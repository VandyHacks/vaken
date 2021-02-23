/**
 * This file contains mock responses for the queries defined in the corresponding `.graphql.ts`
 * file. It is included in `.storybook/preview.js` to provide default responses for every graphql
 * query in Storybook story files.
 */
import { MockedResponse } from '@apollo/client/testing';
import {
	EventsDocument,
	EventsForHackersDocument,
	MyEventStatusDocument,
	EventsQueryResult,
	EventsForHackersQueryResult,
	MyEventStatusQueryResult,
} from '../../generated/graphql';
import { MOCK_CHECK_IN_EVENT, MOCK_HACKER } from '../../../common/mockObjects';

export const EventsQueryMock: MockedResponse<EventsQueryResult['data']> = {
	request: {
		query: EventsDocument,
	},
	result: {
		data: {
			events: [MOCK_CHECK_IN_EVENT],
		},
	},
};

export const EventsForHackersQueryMock: MockedResponse<EventsForHackersQueryResult['data']> = {
	request: {
		query: EventsForHackersDocument,
	},
	result: {
		data: {
			events: [{ ...MOCK_CHECK_IN_EVENT, __typename: 'Event' }],
		},
	},
};

export const MyEventStatusQueryMock: MockedResponse<MyEventStatusQueryResult['data']> = {
	request: {
		query: MyEventStatusDocument,
	},
	result: {
		data: {
			me: {
				__typename: 'Hacker',
				eventsAttended: MOCK_HACKER.eventsAttended,
				id: MOCK_HACKER.id,
				eventScore: MOCK_HACKER.eventScore,
			},
		},
	},
};
