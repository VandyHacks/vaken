/**
 * This file contains mock responses for the queries defined in the corresponding `.graphql.ts`
 * file. It is included in `.storybook/preview.js` to provide default responses for every graphql
 * query in Storybook story files.
 */
import { MockedResponse } from '@apollo/client/testing';
import {
	HackersDocument,
	DetailedHackerDocument,
	HackersQueryResult,
	DetailedHackerQueryResult,
} from '../../generated/graphql';
import { MOCK_HACKER, MOCK_HACKERS } from '../../../common/mockObjects';

export const HackersQueryMock: MockedResponse<NonNullable<HackersQueryResult['data']>> = {
	request: {
		query: HackersDocument,
	},
	result: {
		data: {
			hackers: MOCK_HACKERS,
		},
	},
};

export const DetailedHackerQueryMock: MockedResponse<
	NonNullable<DetailedHackerQueryResult['data']>
> = {
	request: {
		query: DetailedHackerDocument,
		variables: { id: MOCK_HACKER.id },
	},
	result: {
		data: {
			hacker: MOCK_HACKER,
		},
	},
};
