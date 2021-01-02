import Context from '../context';
import { ApplicationFieldResolvers } from '../generated/graphql';
import { queryById } from './helpers';

export const ApplicationField: ApplicationFieldResolvers<Context> = {
	answer: async field => (await field).answer || '',
	createdAt: async field => (await field).createdAt.getTime(),
	id: async field => (await field).id,
	question: async field => (await field).question,
	userId: async (field, _, { models }) => queryById(`${(await field).userId}`, models.Hackers),
};
