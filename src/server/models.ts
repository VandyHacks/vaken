import { MongoClient, Collection } from 'mongodb';
import {
	ApplicationFieldDbObject,
	ApplicationQuestionDbObject,
	HackerDbObject,
	LoginDbObject,
	MentorDbObject,
	OrganizerDbObject,
	ShiftDbObject,
	TeamDbObject,
} from './generated/graphql';

export interface UserTeamIndexDbObject {
	email: string;
	team: string;
}

export interface Models {
	ApplicationFields: Collection<ApplicationFieldDbObject>;
	ApplicationQuestions: Collection<ApplicationQuestionDbObject>;
	Hackers: Collection<HackerDbObject>;
	Logins: Collection<LoginDbObject>;
	Mentors: Collection<MentorDbObject>;
	Organizers: Collection<OrganizerDbObject>;
	Shifts: Collection<ShiftDbObject>;
	Teams: Collection<TeamDbObject>;
	UserTeamIndicies: Collection<UserTeamIndexDbObject>;
}

export const initDb = async (): Promise<Models> => {
	const dbUrl = process.env.MONGODB_BASE_URL || 'mongodb://localhost:27017';
	// creates the db the first time it's called if it doesn't exist
	const db = (await MongoClient.connect(dbUrl, { useNewUrlParser: true })).db('vaken');

	return {
		/**
		 * creates the collections the first time it's called if it doesn't exist
		 * NOTE: these will not show up initially in MongoDB Atlas UI until they're no longer empty collections
		 */
		ApplicationFields: db.collection<ApplicationFieldDbObject>('applicationFields'),
		ApplicationQuestions: db.collection<ApplicationQuestionDbObject>('applicationQuestions'),
		Hackers: db.collection<HackerDbObject>('Hackers'),
		Logins: db.collection<LoginDbObject>('logins'),
		Mentors: db.collection<MentorDbObject>('mentors'),
		Organizers: db.collection<OrganizerDbObject>('organizers'),
		Shifts: db.collection<ShiftDbObject>('shifts'),
		Teams: db.collection<TeamDbObject>('teams'),
		UserTeamIndicies: db.collection<UserTeamIndexDbObject>('userTeams'),
	};
};

export default initDb();
