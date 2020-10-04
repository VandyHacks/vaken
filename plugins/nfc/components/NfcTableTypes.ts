import { SortDirectionType } from 'react-virtualized';

import { MutationFunction } from '@apollo/client';
import {
	_Plugin__RegisterNfcuidWithUserMutation,
	_Plugin__RegisterNfcuidWithUserMutationVariables,
	_Plugin__CheckInUserToEventMutation,
	_Plugin__CheckInUserToEventMutationVariables,
	_Plugin__RemoveUserFromEventMutation,
	_Plugin__RemoveUserFromEventMutationVariables,
	_Plugin__CheckInUserToEventByNfcMutation,
	_Plugin__CheckInUserToEventByNfcMutationVariables,
	_Plugin__RemoveUserFromEventByNfcMutation,
	_Plugin__RemoveUserFromEventByNfcMutationVariables,
	HackersQuery,
	EventsQuery,
} from '../../../src/client/generated/graphql';

type ArrayType<T> = T extends (infer U)[] ? U : never;
export type QueriedHacker = ArrayType<HackersQuery['hackers']>;
export type QueriedEvent = ArrayType<EventsQuery['events']>;

export interface SortFnProps {
	sortBy?: keyof QueriedHacker;
	sortDirection?: SortDirectionType;
}

export type _Plugin__RegisterNfcuidWithUserMutationFn = MutationFunction<
	_Plugin__RegisterNfcuidWithUserMutation,
	_Plugin__RegisterNfcuidWithUserMutationVariables
>;

export type _Plugin__CheckInUserToEventMutationFn = MutationFunction<
	_Plugin__CheckInUserToEventMutation,
	_Plugin__CheckInUserToEventMutationVariables
>;

export type _Plugin__RemoveUserFromEventMutationFn = MutationFunction<
	_Plugin__RemoveUserFromEventMutation,
	_Plugin__RemoveUserFromEventMutationVariables
>;

export type _Plugin__CheckInUserToEventByNfcMutationFn = MutationFunction<
	_Plugin__CheckInUserToEventByNfcMutation,
	_Plugin__CheckInUserToEventByNfcMutationVariables
>;

export type _Plugin__RemoveUserFromEventByNfcMutationFn = MutationFunction<
	_Plugin__RemoveUserFromEventByNfcMutation,
	_Plugin__RemoveUserFromEventByNfcMutationVariables
>;
