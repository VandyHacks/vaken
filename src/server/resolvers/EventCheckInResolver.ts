import Context from '../context';
import { EventCheckInResolvers } from '../generated/graphql';

export const EventCheckIn: EventCheckInResolvers<Context> = {
	id: async eventCheckIn => (await eventCheckIn)._id.toHexString(),
	timestamp: async eventCheckIn => (await eventCheckIn).timestamp.getTime(),
	user: async eventCheckIn => (await eventCheckIn).user,
};
