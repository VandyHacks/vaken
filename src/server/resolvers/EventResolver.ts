import Context from '../context';
import { EventResolvers } from '../generated/graphql';

export const Event: EventResolvers<Context> = {
	attendees: async event => (await event).attendees || [],
	checkins: async event => (await event).checkins || [],
	description: async event => (await event).description || null,
	duration: async event => (await event).duration,
	eventType: async event => (await event).eventType,
	eventScore: async event => (await event).eventScore || 0,
	id: async event => (await event)._id.toHexString(),
	location: async event => (await event).location,
	name: async event => (await event).name,
	startTimestamp: async event => (await event).startTimestamp.getTime(),
	warnRepeatedCheckins: async event => (await event).warnRepeatedCheckins,
	gcalID: async event => (await event).gcalID || null,
	owner: async event => (await event).owner || null,
};
