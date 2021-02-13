/**
 * This file contains mock responses for the queries defined in the corresponding `.graphql.ts`
 * file. It is included in `.storybook/preview.js` to provide default responses for every graphql
 * query in Storybook story files.
 */
import { MockedResponse } from '@apollo/client/testing';
import { MeDocument, MeQueryResult } from './generated/graphql';
import { MOCK_HACKER } from '../common/mockObjects';

export const MeQueryMock: MockedResponse<MeQueryResult['data']> = {
	request: {
		query: MeDocument,
	},
	result: {
		data: {
			me: MOCK_HACKER,
		},
	},
};
