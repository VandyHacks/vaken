import { GraphQLSchema } from 'graphql';
import app, { schema } from './index';

describe('Test Profile', () => {
	it('initializes', async () => {
		expect(app).toBeTruthy();
		expect(schema).toBeInstanceOf(GraphQLSchema);
	});
});
