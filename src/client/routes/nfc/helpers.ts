import {
	QueriedEvent,
	QueriedHacker,
	RegisterNfcuidWithUserMutationFn,
	CheckInUserToEventMutationFn,
	RemoveUserFromEventMutationFn,
	CheckInUserToEventByNfcMutationFn,
	RemoveUserFromEventByNfcMutationFn,
} from './NfcTableTypes';

export const CHECK_IN_EVENT_TYPE = 'CHECK_IN';
export const NFC_CODE_MIN_LENGTH = 5;

export const createMatchCriteria = (searchValue: string) => (hacker: QueriedHacker): boolean => {
	for (let word of searchValue.split(' ')) {
		if (!word || word.length === 0) continue;

		// if no words match, return false
		if (
			!hacker.firstName.toLowerCase().includes(word) &&
			!hacker.lastName.toLowerCase().includes(word) &&
			!hacker.email.toLowerCase().includes(word) &&
			(!hacker.school || !hacker.school.toLowerCase().includes(word))
		)
			return false;
	}
	return true;
};

// assigns the row names for styling
export const generateRowClassName = ({ index }: { index: number }): string => {
	let className;
	if (index < 0) className = 'headerRow';
	else {
		className = index % 2 === 0 ? 'evenRow' : 'oddRow';
	}
	return className;
};

export const createSubmitHandler = (
	registerFunction: RegisterNfcuidWithUserMutationFn,
	markAttendedFunction: CheckInUserToEventMutationFn,
	removeFunction: RemoveUserFromEventMutationFn,
	markAttendedByNfcFunction: CheckInUserToEventByNfcMutationFn,
	removeByNfcFunction: RemoveUserFromEventByNfcMutationFn
) => (nfc: string, user: string, event: QueriedEvent, unadmit: boolean): boolean => {
	console.log([nfc, user, event, unadmit]);
	if (event.eventType == CHECK_IN_EVENT_TYPE) {
		if (nfc.length < NFC_CODE_MIN_LENGTH) {
			return false;
		}

		registerFunction({
			variables: {
				input: {
					nfcid: nfc,
					user: user,
				},
			},
		});
		return true;
	} else {
		if (user.length) {
			if (unadmit) {
				removeFunction({
					variables: {
						input: {
							event: event.id,
							user: user,
						},
					},
				});
			} else {
				markAttendedFunction({
					variables: {
						input: {
							event: event.id,
							user: user,
						},
					},
				});
			}
			return true;
		} else if (nfc.length > NFC_CODE_MIN_LENGTH) {
			if (unadmit) {
				removeByNfcFunction({
					variables: {
						input: {
							event: event.id,
							nfcId: nfc,
						},
					},
				});
			} else {
				markAttendedByNfcFunction({
					variables: {
						input: {
							event: event.id,
							nfcId: nfc,
						},
					},
				});
			}
			return true;
		}
		return false;
	}
};
