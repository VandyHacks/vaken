/**
 * This file contains mock responses for the queries defined in the corresponding `.graphql.ts`
 * file. It is included in `.storybook/preview.js` to provide default responses for every graphql
 * query in Storybook story files.
 */
import { MockedResponse } from '@apollo/client/testing';
import { MyStatusDocument, MyStatusQueryResult, ApplicationStatus } from '../../generated/graphql';
import { MOCK_HACKER } from '../../../common/mockObjects';

export const MyStatusQueryMock: MockedResponse<MyStatusQueryResult['data']> = {
	request: {
		query: MyStatusDocument,
	},
	result: {
		data: {
			me: {
				id: MOCK_HACKER.id,
				status: ApplicationStatus.Submitted,
				__typename: 'Hacker',
			},
		},
	},
};
