import { MutationFunction } from '@apollo/react-common';
import {
	AddOrUpdateEventMutation,
	AddOrUpdateEventMutationVariables,
	AssignEventToCompanyMutation,
	AssignEventToCompanyMutationVariables,
} from '../../generated/graphql';

export interface EventUpdate {
	name: string;
	startTimestamp: string; // UTC time in format YYYY-MM-DDTHH:MM:SS.mmm+00:00
	duration: number;
	description: string;
	location: string;
	eventType: string;
	gcalID?: string;
	id?: string;
}

export type AddOrUpdateEventMutationFn = MutationFunction<
	AddOrUpdateEventMutation,
	AddOrUpdateEventMutationVariables
>;

export type AssignEventToCompanyMutationFn = MutationFunction<
	AssignEventToCompanyMutation,
	AssignEventToCompanyMutationVariables
>;
