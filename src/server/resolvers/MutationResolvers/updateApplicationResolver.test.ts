import { makeExecutableSchema, addMocksToSchema } from 'graphql-tools';
import { Db } from 'mongodb';
import { ApolloServer } from 'apollo-server-express';
import Context from 'src/server/context';
import gqlSchema from '../../../common/schema.graphql';
import DB, { Models } from '../../models';
import { query } from '../helpers';

import { resolvers } from '../index';

let dbClient: DB;
let models: Models;

beforeAll(async () => {
	try {
		dbClient = new DB(process.env.MONGO_URL);
		models = await dbClient.collections;
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err);
	}
});

describe('test application update resolver', async () => {
	const db = (await dbClient.client).db('vaken');
	const context: Context = { db, models };

	const applicationUpdateResolver = await resolvers.Mutation?.updateMyApplication;

	// // // the typing of resolvers doesn't guarantee Mutation is a member
	// // // ... but we're in big trouble if it's not, so might as well test
	// // expect(applicationUpdateResolver === undefined).resolves.toEqual(false);

	// if (applicationUpdateResolver === undefined)
	// 	throw new Error('applicationUpdateResolver is undefined');

	// // https://www.graphql-tools.com/docs/mocking/
	// const schema = makeExecutableSchema({ typeDefs: gqlSchema });
	// const mockedSchema = addMocksToSchema({ schema });

	await applicationUpdateResolver({}, { input: { fields: [] } }, context, {});
});
