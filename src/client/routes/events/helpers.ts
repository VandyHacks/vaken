import {
	EventUpdate,
	AddOrUpdateEventMutationFn,
	AssignEventToCompanyMutationFn,
	RemoveAbsentEventsMutationFn,
} from './ManageEventTypes';

export async function updateEventsHandler(
	events: null | EventUpdate[],
	addOrUpdateEventFunction: AddOrUpdateEventMutationFn,
	removeAbsentEventsFunction: RemoveAbsentEventsMutationFn
): Promise<string[]> {
	if (events) {
		const updatedEvents = await Promise.all(
			events.map(async event => {
				const result = await addOrUpdateEventFunction({
					variables: {
						input: {
							...event,
						},
					},
				});

				if (!result.data)
					throw new Error(`${(result.errors || []).map(error => JSON.stringify(error))}`);

				return result.data.addOrUpdateEvent;
			})
		);

		const removeRet = await removeAbsentEventsFunction({
			variables: {
				input: {
					ids: updatedEvents.map(e => e.id),
				},
			},
		});

		if (!removeRet.data)
			throw new Error(`${(removeRet.errors || []).map(error => JSON.stringify(error))}`);

		return updatedEvents.map(e => e.name);
	}
	return [];
}

export async function assignEventHandler(
	eventID: string,
	companyID: string,
	assignEventToCompanyFunction: AssignEventToCompanyMutationFn
): Promise<void> {
	if (eventID && companyID) {
		await assignEventToCompanyFunction({
			variables: {
				input: {
					companyId: companyID,
					eventId: eventID,
				},
			},
		});
	}
}
