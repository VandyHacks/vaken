import Context from '../context';
import { CompanyResolvers } from '../generated/graphql';

export const Company: CompanyResolvers<Context> = {
	id: async comp => (await comp)._id.toHexString(),
	name: async comp => (await comp).name,
	tier: async comp => (await comp).tier,
	eventsOwned: async comp => (await comp).eventsOwned || [],
};
