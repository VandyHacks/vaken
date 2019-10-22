import { EventUpdate, AddOrUpdateEventMutationFn } from './ManageEventTypes';

export function updateEventsHandler(
	events: null | EventUpdate[],
	addOrUpdateEventFunction: AddOrUpdateEventMutationFn
): string[] {
	if (events) {
		events.map(event =>
			addOrUpdateEventFunction({
				variables: {
					input: {
						...event,
					},
				},
			})
		);
	}
	return [];
}
