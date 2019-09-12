import { ObjectID } from 'mongodb';
import faker from 'faker';
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

require('dotenv').config();

const getRandom = (max: number): number => Math.floor(Math.random() * max);
const NUM_HACKERS = 800;

const generateHacker: () => HackerDbObject = () => {
	const fn = faker.name.firstName();
	const ln = faker.name.lastName();
	return {
		_id: new ObjectID(),
		createdAt: new Date(),
		dietaryRestrictions: [Object.values(DietaryRestriction)[getRandom(7)]],
		email: faker.internet.email(),
		firstName: fn,
		gender: Object.values(Gender)[getRandom(7)],
		gradYear: getRandom(4) + 2019,
		lastName: ln,
		logins: [],
		majors: [],
		modifiedAt: new Date().getTime(),
		phoneNumber: faker.phone.phoneNumber(),
		preferredName: fn,
		race: [Object.values(Race)[getRandom(6)]],
		school: institutions[getRandom(1430)],
		secondaryIds: [],
		shirtSize: Object.values(ShirtSize)[getRandom(6)],
		status: Object.values(ApplicationStatus)[getRandom(7)],
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

	console.log(`Adding the hackes to the DB...`);
	const { insertedCount } = await models.Hackers.insertMany(newHackers);
	console.log(`Inserted ${insertedCount} new hackers`);
	process.exit(0);
};

addHackers();
