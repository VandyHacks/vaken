import Context from '../context';
import { TeamResolvers } from '../generated/graphql';

export const Team: TeamResolvers<Context> = {
	createdAt: async team => (await team).createdAt.getTime(),
	id: async team => (await team)._id.toHexString(),
	memberIds: async team => (await team).memberIds,
	name: async team => (await team).name || null,
	size: async team => (await team).memberIds.length,
};
