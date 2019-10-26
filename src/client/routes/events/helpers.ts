import { EventUpdate, AddOrUpdateEventMutationFn } from './ManageEventTypes';

export function updateEventsHandler(
	events: null | EventUpdate[],
	addOrUpdateEventFunction: AddOrUpdateEventMutationFn
): string[] {
	if (events) {
		events.forEach(event =>
			addOrUpdateEventFunction({
				variables: {
					input: {
						...event,
					},
				},
			})
		);
		return events.map(event => event.name);
	}
	return [];
}
