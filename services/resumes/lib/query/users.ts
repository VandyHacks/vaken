import { gql } from '@apollo/client';
import { NON_CACHING_CLIENT } from '../../../common';
import { HackersQuery, HackersDocument } from './generated.graphql';

const { GATEWAY_BEARER_TOKEN } = process.env;
if (!GATEWAY_BEARER_TOKEN) {
	console.warn(
		'GATEWAY_BEARER_TOKEN not set. Bearer token auth will be disabled. This ' +
			'will adversely affect the resume dump url service.'
	);
}

export default gql`
	query Hackers {
		users(first: 10000, filter: APPLICATION_SUBMITTED) {
			id
			email
		}
	}
`;

export type HackersQueryResult = HackersQuery['users'] | null;
export async function getHackers(): Promise<HackersQueryResult> {
	try {
		const result = await NON_CACHING_CLIENT.query({ query: HackersDocument });
		return result.data?.users ?? null;
	} catch (e: unknown) {
		console.error(JSON.stringify(e));
		return null;
	}
}
