import { ObjectID } from 'mongodb';
import faker from 'faker';
import { config as dotenvConfig } from 'dotenv';
import { Storage } from '@google-cloud/storage';
import institutions from '../src/client/assets/data/institutions.json';
import {
	ApplicationStatus,
	ShirtSize,
	Gender,
	DietaryRestriction,
	Race,
	UserType,
	HackerDbObject,
} from '../src/server/generated/graphql';
import DB from '../src/server/models';
import { RESUME_DUMP_NAME } from '../src/client/assets/strings.json';

dotenvConfig();

const printUsage = (): void => {
	void console.log('Usage: INCLUDE_RESUMES=[true | false] ts-node ./scripts/downloadResumes.ts');
};

const { INCLUDE_RESUMES } = process.env;
if (!INCLUDE_RESUMES) {
	printUsage();
	process.exit(1);
}
const includeResumes = INCLUDE_RESUMES === 'true';

const NUM_HACKERS = 200;

const generateHacker: () => HackerDbObject = () => {
	const fn = faker.name.firstName();
	const ln = faker.name.lastName();
	return {
		_id: new ObjectID(),
		application: [],
		createdAt: new Date(),
		dietaryRestrictions: [Object.values(DietaryRestriction)[faker.random.number(7)]].join('|'),
		email: faker.internet.email(),
		emailUnsubscribed: false,
		eventsAttended: [],
		eventScore: 0,
		firstName: fn,
		gender: Object.values(Gender)[faker.random.number(7)],
		gradYear: `${faker.random.number(4) + 2019}`,
		lastName: ln,
		logins: [],
		majors: [],
		modifiedAt: new Date().getTime(),
		phoneNumber: faker.phone.phoneNumber(),
		preferredName: fn,
		race: [Object.values(Race)[faker.random.number(6)]].join('|'),
		school: institutions.data[faker.random.number(1430)],
		secondaryIds: [],
		shirtSize: Object.values(ShirtSize)[faker.random.number(6)],
		status: Object.values(ApplicationStatus)[faker.random.number(6)],
		userType: UserType.Hacker,
	};
};

const addHackers = async (): Promise<void> => {
	const models = await new DB().collections;
	console.log('Connected to DB');
	const newHackers: HackerDbObject[] = [];
	for (let i = 1; i <= NUM_HACKERS; i += 1) {
		if (i % 100 === 0) console.log(`Creating hacker ${i}`);
		newHackers.push(generateHacker());
	}

	console.log(`Adding the hackers to the DB...`);
	const { insertedCount } = await models.Hackers.insertMany(newHackers);
	console.log(`Inserted ${insertedCount} new hackers`);
	if (includeResumes) {
		console.log('Uploading resumes...');
		const bucket = new Storage(JSON.parse(process.env.GCP_STORAGE_SERVICE_ACCOUNT ?? '')).bucket(
			process.env.BUCKET_NAME ?? ''
		);

		await bucket.file(RESUME_DUMP_NAME).delete({ ignoreNotFound: true });

		await Promise.all(
			newHackers.map(async hacker => {
				const id = hacker._id.toHexString();
				try {
					const contents = `Filler resume for ${hacker.firstName} ${hacker.lastName}.`;
					await bucket.file(id).save(contents, {
						resumable: false,
						validation: false,
					});
					console.log(contents);
				} catch (e) {
					console.group('Error:');
					console.error(e);
					console.info('Hacker ID:', hacker._id);
					console.groupEnd();
				}
			})
		);
	}
	process.exit(0);
};

addHackers();
