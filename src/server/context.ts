// Context must be outside of `index.ts` for it to be importable by the resolvers.

import { Models } from './models';
import { UserDbInterface } from './generated/graphql';
import { MongoClient, Db } from 'mongodb'

export default interface Context {
	db: Db;
	models: Models;
	user?: UserDbInterface;
}
