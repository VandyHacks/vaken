import { MutationFunction } from '@apollo/react-common';
import {
	AddOrUpdateEventMutation,
	AddOrUpdateEventMutationVariables,
} from '../../generated/graphql';

export interface EventUpdate {
	name: string;
	startTimestamp: string;
	duration: number;
	description: string;
	location: string;
	eventType: string;
}

export type AddOrUpdateEventMutationFn = MutationFunction<
	AddOrUpdateEventMutation,
	AddOrUpdateEventMutationVariables
>;
