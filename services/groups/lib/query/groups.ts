import { gql } from '@apollo/client';
import { NON_CACHING_CLIENT } from '../../../common/client';
import { GroupDocument, GroupQuery, GroupQueryVariables } from './generated.graphql';

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
