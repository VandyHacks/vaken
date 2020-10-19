import { SortDirectionType } from 'react-virtualized';

import { MutationFunction } from '@apollo/client';
import {
	RegisterNfcuidWithUserMutation,
	RegisterNfcuidWithUserMutationVariables,
	CheckInUserToEventMutation,
	CheckInUserToEventMutationVariables,
	RemoveUserFromEventMutation,
	RemoveUserFromEventMutationVariables,
	CheckInUserToEventByNfcMutation,
	CheckInUserToEventByNfcMutationVariables,
	RemoveUserFromEventByNfcMutation,
	RemoveUserFromEventByNfcMutationVariables,
	HackersQuery,
	EventsQuery,
} from '../../generated/graphql';

type ArrayType<T> = T extends (infer U)[] ? U : never;
export type QueriedHacker = ArrayType<HackersQuery['hackers']>;
export type QueriedEvent = ArrayType<EventsQuery['events']>;

export interface SortFnProps {
	sortBy?: keyof QueriedHacker;
	sortDirection?: SortDirectionType;
}

export type RegisterNfcuidWithUserMutationFn = MutationFunction<
	RegisterNfcuidWithUserMutation,
	RegisterNfcuidWithUserMutationVariables
>;

export type CheckInUserToEventMutationFn = MutationFunction<
	CheckInUserToEventMutation,
	CheckInUserToEventMutationVariables
>;

export type RemoveUserFromEventMutationFn = MutationFunction<
	RemoveUserFromEventMutation,
	RemoveUserFromEventMutationVariables
>;

export type CheckInUserToEventByNfcMutationFn = MutationFunction<
	CheckInUserToEventByNfcMutation,
	CheckInUserToEventByNfcMutationVariables
>;

export type RemoveUserFromEventByNfcMutationFn = MutationFunction<
	RemoveUserFromEventByNfcMutation,
	RemoveUserFromEventByNfcMutationVariables
>;
