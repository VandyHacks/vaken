import { gql } from '@apollo/client';
import { NON_CACHING_CLIENT } from '../../../common/client';
import { HackersQuery, HackersDocument } from './generated.graphql';

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
