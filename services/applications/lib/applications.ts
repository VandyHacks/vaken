import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Filter } from 'mongodb';
import joi from 'joi';
import { ValidationError } from 'apollo-server';
import {
	ApplicationDbObject,
	Application,
	AgeEligibility,
	ShirtSize,
	ApplicationStatus,
	VolunteerOption,
	DietaryRestriction,
	Gender,
	Race,
	ApplicationField,
	ApplicationFieldDbObject,
} from './generated.graphql';
import { notEmpty, valueOf } from '../../../common/util/predicates';

const APPLICATION_EXTRACTED_FIELDS = Object.freeze([
	'adult',
	'dietaryRestrictions',
	'firstName',
	'gender',
	'gradYear',
	'lastName',
	'majors',
	'preferredName',
	'race',
	'school',
	'shirtSize',
	'volunteer',
]);

const APPLICATION_DESERIALIZED_FIELDS = Object.freeze([
	'dietaryRestrictions',
	'gender',
	'majors',
	'race',
]);

const APPLICATION_FIELDS_VALIDATOR = joi
	.array()
	.items(
		joi.object({
			field: joi.string().max(500).required(),
			response: joi.string().max(20000),
		})
	)
	.max(50);

const APPLICATION_DOMAIN_SCHEMA = joi.object({
	adult: joi.string().allow(...Object.keys(AgeEligibility)),
	dietaryRestrictions: joi.object({
		dietaryRestriction: joi
			.array()
			.allow(...Object.keys(DietaryRestriction))
			.unique()
			.optional(),

		other: joi.string().alphanum().max(8000).optional(),
	}),
	firstName: joi.string().max(1000),

	gender: joi
		.object({
			gender: joi.string().allow(...Object.keys(Gender)),
			other: joi.string().alphanum().max(8000),
		})
		.oxor('other', 'gender'),

	gradYear: joi.number().min(1900).max(2100),

	lastName: joi.string().max(1000),

	majors: joi.array().items(joi.string().max(500)).max(20),

	preferredName: joi.string().max(1000),

	race: joi
		.object({
			race: joi.string().allow(...Object.keys(Race)),
			other: joi.string().alphanum().max(8000),
		})
		.oxor('other', 'race'),

	school: joi.string().max(1000),

	shirtSize: joi.string().allow(...Object.keys(ShirtSize)),

	volunteer: joi.string().allow(...Object.keys(VolunteerOption)),

	application: joi.array().items(
		joi.object({
			field: joi
				.string()
				.disallow(...APPLICATION_EXTRACTED_FIELDS)
				.max(500)
				.required(),

			response: joi.string().max(20000).optional(),
		})
	),
});

const APPLICATION_DB_SCHEMA_VALIDATOR = APPLICATION_DOMAIN_SCHEMA.keys({ userId: joi.string() });

export function applicationFieldsToDbObjectConverter(
	userId: string,
	fields?: ApplicationField[] | null
): ApplicationDbObject {
	if (!fields || !fields.length) {
		throw new ValidationError('Application empty');
	}
	const inputValidationResult = APPLICATION_FIELDS_VALIDATOR.validate(fields);
	if (inputValidationResult.error) {
		throw new ValidationError(inputValidationResult.error.message);
	}
	let application: ApplicationDbObject & { application: ApplicationFieldDbObject[] } = {
		application: [],
		userId,
	};
	for (const { field, response } of fields) {
		if (!field) continue;
		if (APPLICATION_EXTRACTED_FIELDS.includes(field)) {
			application = {
				...application,
				[field]:
					APPLICATION_DESERIALIZED_FIELDS.includes(field) && response
						? JSON.parse(response)
						: response,
			};
		} else {
			application.application.push({ field, response });
		}
	}

	const validationResult = APPLICATION_DB_SCHEMA_VALIDATOR.validate(application);
	if (validationResult.error) {
		throw new ValidationError(validationResult.error.message);
	}
	return validationResult.value;
}

export function applicationDbObjectToDomainConverter(
	applicationDbObject?: ApplicationDbObject | null
): Application | null {
	if (!applicationDbObject) return null;
	return {
		...applicationDbObject,
		modifiedAt: applicationDbObject.modifiedAt?.getTime(),
		dietaryRestrictions: {
			...applicationDbObject.dietaryRestrictions,
			dietaryRestriction:
				applicationDbObject.dietaryRestrictions?.dietaryRestriction?.filter(
					valueOf(DietaryRestriction)
				) ?? [],
		},
		gender: {
			...applicationDbObject.gender,
			gender: valueOf(Gender)(applicationDbObject.gender?.gender)
				? applicationDbObject.gender?.gender
				: null,
		},
		race: {
			...applicationDbObject.race,
			race: applicationDbObject.race?.race?.filter(valueOf(Race)) ?? [],
		},
		adult: valueOf(AgeEligibility)(applicationDbObject.adult) ? applicationDbObject.adult : null,
		shirtSize: valueOf(ShirtSize)(applicationDbObject.shirtSize)
			? applicationDbObject.shirtSize
			: null,
		status: valueOf(ApplicationStatus)(applicationDbObject.status)
			? applicationDbObject.status
			: null,
		volunteer: valueOf(VolunteerOption)(applicationDbObject.volunteer)
			? applicationDbObject.volunteer
			: null,
	};
}

export function isApplicationComplete(application: ApplicationDbObject): boolean {
	const result = APPLICATION_DOMAIN_SCHEMA.validate(application, { presence: 'required' });
	return !result.error;
}

interface SaveOptions {
	updateStatus?: boolean;
}

export class Applications extends MongoDataSource<ApplicationDbObject> {
	private async lookupApplication(
		filterOrIds: Filter<ApplicationDbObject> | string[],
		{ limit = 1 } = {}
	): Promise<Application[]> {
		const filter: Filter<ApplicationDbObject> =
			filterOrIds instanceof Array ? { userId: { $in: filterOrIds } } : filterOrIds;

		return (await this.collection.find(filter).limit(limit).toArray())
			.map(applicationDbObjectToDomainConverter)
			.filter(notEmpty);
	}

	async getApplicationForUsers(userId: string): Promise<Application | null>;
	async getApplicationForUsers(userIds: string[]): Promise<Application[]>;
	async getApplicationForUsers(
		userIds: string | string[]
	): Promise<Application | Application[] | null> {
		const ids = userIds instanceof Array ? userIds : [userIds];
		const result = await this.lookupApplication(ids, { limit: ids.length });
		return userIds instanceof Array ? result : result[0] ?? null;
	}

	async saveApplication(
		userId: string,
		applicationField: ApplicationField[],
		{ updateStatus = false }: SaveOptions = {}
	) {
		const dbObject = applicationFieldsToDbObjectConverter(userId, applicationField);
		console.error(dbObject);
		if (updateStatus) {
			dbObject.status = isApplicationComplete(dbObject)
				? ApplicationStatus.Submitted
				: ApplicationStatus.Started;
		} else {
			// DB object converter does not return a status field, so it will not be set.
		}
		const result = await this.collection.findOneAndUpdate(
			{ userId },
			{
				$set: { ...dbObject, modifiedAt: new Date() },
				$setOnInsert: { status: ApplicationStatus.Started },
			},
			{ returnDocument: 'after', upsert: true }
		);
		console.error(result);
		return applicationDbObjectToDomainConverter(result.value);
	}

	async setUserApplicationStatus(userIds: string[], status: ApplicationStatus): Promise<void> {
		await this.collection.updateMany(
			// Due to the distributed structure, the Applications domain cannot know
			// if a given userId is valid or not. Assume it is for resiliency.
			{ userId: { $in: userIds } },
			{ $set: { status } },
			{ upsert: true } // allows admins to admit users who have not filled out the application
		);
	}
}
