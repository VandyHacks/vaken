import Context from '../context';
import { ShiftResolvers } from '../generated/graphql';

export const Shift: ShiftResolvers<Context> = {
	begin: async shift => (await shift).begin.getTime(),
	end: async shift => (await shift).end.getTime(),
};
