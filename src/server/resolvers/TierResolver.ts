import Context from '../context';
import { TierResolvers } from '../generated/graphql';

export const Tier: TierResolvers<Context> = {
	id: async tier => (await tier)._id.toHexString(),
	name: async tier => (await tier).name,
	permissions: async tier => (await tier).permissions,
};
