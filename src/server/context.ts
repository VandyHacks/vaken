// Context must be outside of `index.ts` for it to be importable by the resolvers.

import { Models } from './models';
import { UserDbInterface } from './generated/graphql';
import { MongoClient } from 'mongodb'

export default interface Context {
	db: Promise<MongoClient>;
	models: Models;
	user?: UserDbInterface;
}
