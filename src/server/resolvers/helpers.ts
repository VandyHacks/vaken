import { UserInputError, ApolloError, AuthenticationError } from 'apollo-server-express';
import { ObjectID, Collection, ObjectId, FilterQuery } from 'mongodb';
import {
	DietaryRestriction,
	UserType,
	ShirtSize,
	UserDbInterface,
	UserInput,
	Gender,
} from '../generated/graphql';
import { Models } from '../models';

/**
 * Higher-order function creating a verification function for an enum. When
 * used in the form `toEnum(myEnum)(myVal)`, will ensure that `myVal` is a
 * value of `myEnum` and return the value coerced to a value of the enum.
 * @param enumObject Enum object containing values to compare the input against.
 */
export function toEnum<T extends {}>(enumObject: T): (input: string) => T[keyof T] {
	return (input: string): T[keyof T] => {
		if (!Object.values(enumObject).includes(input)) {
			throw new UserInputError(
				`Invalid enum value: "${input}" is not in "${JSON.stringify(Object.values(enumObject))}"`
			);
		}
		return (input as unknown) as T[keyof T];
	};
}

export async function query<T>(filter: FilterQuery<T>, model: Collection<T>): Promise<T> {
	const obj = await model.findOne(filter);
	if (!obj)
		throw new UserInputError(
			`obj with filters: "${JSON.stringify(filter)}" not found in collection "${
				model.collectionName
			}"`
		);
	return obj;
}

export async function queryById<T extends { _id: ObjectId }>(
	id: string,
	model: Collection<T>
): Promise<T> {
	return query<T>({ _id: ObjectID.createFromHexString(id) }, model);
}

export async function updateUser_<T>(
	user: { email: string },
	args: UserInput,
	collection: Collection<T>
): Promise<T> {
	const newValues = {
		...args,
		dietaryRestrictions: args.dietaryRestrictions
			? args.dietaryRestrictions.split('|').map(toEnum(DietaryRestriction))
			: undefined,
		gender: args.gender ? toEnum(Gender)(args.gender) : undefined,
		modifiedAt: new Date().getTime(),
		shirtSize: args.shirtSize ? toEnum(ShirtSize)(args.shirtSize) : undefined,
	};
	const { value } = await collection.findOneAndUpdate(
		{ email: user.email },
		{ $set: newValues },
		{ returnOriginal: false }
	);
	if (!value) throw new UserInputError(`user ${user.email} not found`);
	return value;
}

export async function updateUser(
	user: { email: string; userType: string },
	args: UserInput,
	models: Models
): Promise<UserDbInterface> {
	if (user.userType === UserType.Hacker) {
		return updateUser_(user, args, models.Hackers);
	}
	if (user.userType === UserType.Organizer) {
		return updateUser_(user, args, models.Organizers);
	}
	throw new ApolloError(`updateUser for userType ${user.userType} not implemented`);
}

export async function fetchUser(
	{ email, userType }: { email: string; userType: string },
	models: Models
): Promise<UserDbInterface> {
	if (userType === UserType.Hacker) {
		return query({ email }, models.Hackers);
	}
	if (userType === UserType.Organizer) {
		return query({ email }, models.Organizers);
	}
	throw new ApolloError(`updateUser for userType ${userType} not implemented`);
}

/**
 * Funtion to check if the user has the authorization required to continue.
 * If not, the function will throw a GraphQL AuthenticationError.
 * @param requiredType The authorization level the user should have.
 * @param user The user to check against requiredType.
 * @returns The user object, coerced to a non-null type.
 */
export function checkIsAuthorized<T extends UserDbInterface>(requiredType: UserType, user?: T): T {
	if (!user || requiredType !== user.userType) {
		throw new AuthenticationError(
			`user ${user && user.email}: ${JSON.stringify(user)} must be a "${requiredType}"`
		);
	}

	return user;
}
