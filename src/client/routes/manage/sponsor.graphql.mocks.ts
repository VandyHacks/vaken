/**
 * This file contains mock responses for the queries defined in the corresponding `.graphql.ts`
 * file. It is included in `.storybook/preview.js` to provide default responses for every graphql
 * query in Storybook story files.
 */
import { MockedResponse } from '@apollo/client/testing';
import {
	MeSponsorDocument,
	TiersDocument,
	CompaniesDocument,
	MeSponsorQueryResult,
	TiersQueryResult,
	CompaniesQueryResult,
} from '../../generated/graphql';
import { MOCK_COMPANY, MOCK_SPONSOR_REP, MOCK_TIER } from '../../../common/mockObjects';

export const CompaniesQueryMock: MockedResponse<CompaniesQueryResult['data']> = {
	request: {
		query: CompaniesDocument,
	},
	result: {
		data: {
			companies: [MOCK_COMPANY],
		},
	},
};

export const TiersQueryMock: MockedResponse<TiersQueryResult['data']> = {
	request: {
		query: TiersDocument,
	},
	result: {
		data: {
			tiers: [MOCK_TIER],
		},
	},
};
export const MeSponsorQueryMock: MockedResponse<MeSponsorQueryResult['data']> = {
	request: {
		query: MeSponsorDocument,
	},
	result: {
		data: {
			me: MOCK_SPONSOR_REP,
		},
	},
};
