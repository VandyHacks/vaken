import { MutationFunction } from '@apollo/react-common';
import {
	AddOrUpdateEventMutation,
	AddOrUpdateEventMutationVariables,
	AssignEventToCompanyMutation,
	AssignEventToCompanyMutationVariables,
	RemoveAbsentEventsMutation,
	RemoveAbsentEventsMutationVariables,
} from '../../generated/graphql';

export interface EventUpdate {
	name: string;
	startTimestamp: string; // UTC time in format YYYY-MM-DDTHH:MM:SS.mmm+00:00
	duration: number;
	description: string;
	location: string;
	eventType: string;
	eventScore?: number;
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

export type RemoveAbsentEventsMutationFn = MutationFunction<
	RemoveAbsentEventsMutation,
	RemoveAbsentEventsMutationVariables
>;
