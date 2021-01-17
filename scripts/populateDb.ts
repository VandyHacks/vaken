import { ObjectID } from 'mongodb';
import faker from 'faker';
import { config as dotenvConfig } from 'dotenv';
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

dotenvConfig();

const NUM_HACKERS = 800;

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
	process.exit(0);
};

addHackers();
