import { randomBytes } from 'crypto';

export let { GATEWAY_BEARER_TOKEN = '', PORT = '', MONGODB_URL = '' } = process.env;
if (!GATEWAY_BEARER_TOKEN) {
	console.warn(
		'GATEWAY_BEARER_TOKEN not set. A random bearer token will be generated. This will ' +
			'will adversely affect the functionality of remote services.'
	);
	GATEWAY_BEARER_TOKEN = randomBytes(64).toString('base64');
}

/** Port to expose the backend and all locally-running dependent services. */
if (!PORT) {
	console.warn('PORT not specified. Defaulting to port 4000');
	PORT = '4000';
}

/** URL of the Mongo instance to use */
if (!MONGODB_URL) {
	console.warn('MONGODB_URL not specified. Defaulting to `mongodb://localhost:27017`');
	MONGODB_URL = 'mongodb://localhost:27017';
}
