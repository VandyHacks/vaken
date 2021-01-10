import { EventUpdate } from './ManageEventTypes';
import {
	AddOrUpdateEventMutationHookResult,
	RemoveAbsentEventsMutationHookResult,
	AssignEventToCompanyMutationHookResult,
} from '../../generated/graphql';

export async function updateEventsHandler(
	events: null | EventUpdate[],
	addOrUpdateEvent: AddOrUpdateEventMutationHookResult[0],
	removeAbsentEvents: RemoveAbsentEventsMutationHookResult[0]
): Promise<string[]> {
	if (events) {
		const updatedEvents = await Promise.all(
			events.map(async event => {
				const result = await addOrUpdateEvent({
					variables: {
						input: {
							...event,
						},
					},
				});
				if (!result.data) {
					throw new Error(`${result.errors?.map(error => JSON.stringify(error))}`);
				}
				return result.data.addOrUpdateEvent;
			})
		);

		const removeRet = await removeAbsentEvents({
			variables: {
				input: {
					ids: updatedEvents.map(e => e.id),
				},
			},
		});
		if (!removeRet.data) {
			throw new Error(`${removeRet.errors?.map(error => JSON.stringify(error))}`);
		}
		return updatedEvents.map(e => e.name);
	}
	return [];
}

export async function assignEventHandler(
	eventID: string,
	companyID: string,
	assignEventToCompany: AssignEventToCompanyMutationHookResult[0]
): Promise<void> {
	if (eventID && companyID) {
		await assignEventToCompany({
			variables: {
				input: {
					companyId: companyID,
					eventId: eventID,
				},
			},
		});
	}
}
