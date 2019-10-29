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
	let match = true;
	searchValue.split(' ').forEach(word => {
		// if no words match, return false
		if (
			word.length !== 0 &&
			!hacker.firstName.toLowerCase().includes(word) &&
			!hacker.lastName.toLowerCase().includes(word) &&
			!hacker.email.toLowerCase().includes(word) &&
			(!hacker.school || !hacker.school.toLowerCase().includes(word))
		) {
			match = false;
		}
	});
	return match;
};

// assigns the row names for styling
export const generateRowClassName = (data: QueriedHacker[], topUserMatch: string) => ({
	index,
}: {
	index: number;
}) => {
	if (data[index] && data[index].id === topUserMatch) return 'selected';

	if (index < 0) return 'headerRow';

	return index % 2 === 0 ? 'evenRow' : 'oddRow';
};

export const createSubmitHandler = (
	registerFunction: RegisterNfcuidWithUserMutationFn,
	markAttendedFunction: CheckInUserToEventMutationFn,
	removeFunction: RemoveUserFromEventMutationFn,
	markAttendedByNfcFunction: CheckInUserToEventByNfcMutationFn,
	removeByNfcFunction: RemoveUserFromEventByNfcMutationFn
) => (nfc: string, user: string, event: QueriedEvent, unadmit: boolean): boolean => {
	console.log([nfc, user, event, unadmit]);
	if (event.eventType === CHECK_IN_EVENT_TYPE) {
		if (nfc.length < NFC_CODE_MIN_LENGTH) {
			return false;
		}

		registerFunction({
			variables: {
				input: {
					nfcid: nfc,
					user,
				},
			},
		});
		return true;
	}
	if (user.length) {
		if (unadmit) {
			removeFunction({
				variables: {
					input: {
						event: event.id,
						user,
					},
				},
			});
		} else {
			markAttendedFunction({
				variables: {
					input: {
						event: event.id,
						user,
					},
				},
			});
		}
		return true;
	}
	if (nfc.length > NFC_CODE_MIN_LENGTH) {
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
};
