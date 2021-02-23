/**
 * This file contains mock responses for the queries defined in the corresponding `.graphql.ts`
 * file. It is included in `.storybook/preview.js` to provide default responses for every graphql
 * query in Storybook story files.
 */
import { MockedResponse } from '@apollo/client/testing';
import {
	MyApplicationQueryResult,
	MyApplicationDocument,
	SignedReadUrlQueryResult,
	SignedReadUrlDocument,
} from '../../generated/graphql';
import { MOCK_HACKER } from '../../../common/mockObjects';

export const MyApplicationQueryMock: MockedResponse<MyApplicationQueryResult['data']> = {
	request: {
		query: MyApplicationDocument,
	},
	result: {
		data: {
			me: MOCK_HACKER,
		},
	},
};

export const SignedReadUrlQueryMock: MockedResponse<SignedReadUrlQueryResult['data']> = {
	request: { query: SignedReadUrlDocument, variables: { input: MOCK_HACKER.id } },
	result: {
		data: { signedReadUrl: 'https://vandyhacks.org' },
	},
};

export const SignedReadUrlUnauthenticatedQueryMock: MockedResponse<
	SignedReadUrlQueryResult['data']
> = {
	request: { query: SignedReadUrlDocument, variables: { input: '' } },
	result: {
		data: { signedReadUrl: '' },
	},
};
