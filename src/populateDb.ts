import { ObjectID } from 'mongodb';
import faker from 'faker';
import institutions from './client/assets/data/institutions.json';
import {
	ApplicationStatus,
	ShirtSize,
	Gender,
	DietaryRestriction,
	Race,
	UserType,
	HackerDbObject,
} from './server/generated/graphql';
import modelsPromise from './server/models';

const getRandom = (max: number): number => Math.floor(Math.random() * max);

const addHackers = async (): Promise<void> => {
	const models = await modelsPromise;
	const newHackers: HackerDbObject[] = [];
	for (let i = 0; i < 800; i += 1) {
		const fn = faker.name.firstName();
		const ln = faker.name.lastName();
		console.log(`Adding hacker ${i}`);
		newHackers.push({
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
		});
	}

	console.log(`Adding the hackers`);
	const { insertedCount } = await models.Hackers.insertMany(newHackers);
	console.log(`Inserted ${insertedCount} new hackers`);
};

addHackers();
