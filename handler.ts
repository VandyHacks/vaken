import DB from './src/server/models';
import { checkInUserToEvent } from './src/server/nfc';

let cachedDb: DB = null;

module.exports.checkin = async (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
	if (!cachedDb || !(await cachedDb.client).isConnected()) cachedDb = new DB();

	const { user = '', event: eventID = '' } = JSON.parse(event.body || '{}');
	const res = await checkInUserToEvent(user, eventID, await cachedDb.collections);
	return JSON.stringify(res);
};

module.exports.hackers = async (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
	if (!cachedDb || !(await cachedDb.client).isConnected()) cachedDb = new DB();

	return JSON.stringify(
		(await (await cachedDb.collections).Hackers.find().toArray()).map(({ email }) => ({
			email,
		}))
	);
};
