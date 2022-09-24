import { gql } from '@apollo/client';
import { NON_CACHING_CLIENT } from '../../../common';
import { GroupDocument, GroupQuery, GroupQueryVariables } from './generated.graphql';

const { GATEWAY_BEARER_TOKEN } = process.env;
if (!GATEWAY_BEARER_TOKEN) {
	console.warn(
		'GATEWAY_BEARER_TOKEN not set. Bearer token auth will be disabled. This ' +
			'will adversely affect the groups service.'
	);
}

export default gql`
	query Group($id: ID!) {
		group(groupId: $id) {
			id
			members {
				id
			}
		}
	}
`;

export type GroupQueryResult = GroupQuery['group'] | null;
export async function getGroup(args: GroupQueryVariables): Promise<GroupQueryResult> {
	try {
		const result = await NON_CACHING_CLIENT.query({ query: GroupDocument, variables: args });
		return result.data?.group ?? null;
	} catch (e: unknown) {
		console.error(JSON.stringify(e));
		return null;
	}
}
