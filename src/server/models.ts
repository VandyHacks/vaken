import { Collection, MongoClient } from 'mongodb';
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

export default class DB {
	private client_?: MongoClient;

	/**
	 * Mongo connection URI set in the constructor.
	 */
	private uri: string;

	/**
	 * Lazily-evaluated property to memoize calls to the collections() getter.
	 */
	private collections_?: Models;

	/**
	 * Sets up a connection to a mongo database.
	 * @param mongoUri Connection string to connect to Mongo server.
	 */
	public constructor(mongoUri = '') {
		this.uri = mongoUri || process.env.MONGODB_BASE_URL || 'mongodb://localhost:27017';
	}

	/**
	 * Connects to a mongo server with the uri specified in the constructor.
	 * This method will throw if connection was unsuccessful.
	 */
	public async connect(): Promise<void> {
		this.client_ = await MongoClient.connect(this.uri, { useNewUrlParser: true });
		if (!this.client_) throw new Error('MongoClient not connected');
	}

	/**
	 * Disconnects from the mongo server. Should always be called before
	 * stopping the application.
	 */
	public async disconnect(): Promise<void> {
		if (this.client_) await this.client_.close();
		this.collections_ = undefined;
	}

	/**
	 * Retrieves a reference to the underlying MongoClient used by this class.
	 */
	public get client(): Promise<MongoClient> {
		return (async () => {
			if (!this.client_) await this.connect();
			return this.client_ as MongoClient;
		})();
	}

	/**
	 * Returns a promise to an object containing the Vaken collections. If the
	 * mongo client is not connected, this method will first connect to the uri
	 * passed into the constructor before returning the models.
	 */
	public get collections(): Promise<Models> {
		// Async functions are not supported for the getter itself, so return a
		// promise where we _can_ use async.
		return new Promise(async resolve => {
			if (!this.collections_) {
				const db = (await this.client).db('vaken');
				this.collections_ = {
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
			}

			resolve(this.collections_);
		});
	}
}
