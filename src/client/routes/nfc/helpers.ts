import { toast, cssTransition } from 'react-toastify';
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
) => async (nfc: string, user: string, event: QueriedEvent, unadmit: boolean): Promise<boolean> => {
	console.log([nfc, user, event, unadmit]);
	let toastMsg = '';
	try {
		if (event.eventType === CHECK_IN_EVENT_TYPE) {
			if (nfc.length < NFC_CODE_MIN_LENGTH) {
				return false;
			}

			const { data } = await registerFunction({
				variables: {
					input: {
						nfcid: nfc,
						user,
					},
				},
			});

			if (data)
				toastMsg = `${data.registerNFCUIDWithUser.firstName} ${data.registerNFCUIDWithUser.lastName} registered`;
		} else {
			if (user.length) {
				if (unadmit) {
					const { data } = await removeFunction({
						variables: {
							input: {
								event: event.id,
								user,
							},
						},
					});
					if (data)
						toastMsg = `${data.removeUserFromEvent.firstName} ${data.removeUserFromEvent.lastName} removed`;
				} else {
					const { data } = await markAttendedFunction({
						variables: {
							input: {
								event: event.id,
								user,
							},
						},
					});

					if (data)
						toastMsg = `${data.checkInUserToEvent.firstName} ${data.checkInUserToEvent.lastName} checked in`;
				}
			}
			if (nfc.length > NFC_CODE_MIN_LENGTH) {
				if (unadmit) {
					const { data } = await removeByNfcFunction({
						variables: {
							input: {
								event: event.id,
								nfcId: nfc,
							},
						},
					});
					if (data)
						toastMsg = `${data.removeUserFromEventByNfc.firstName} ${data.removeUserFromEventByNfc.lastName} removed`;
				} else {
					const { data } = await markAttendedByNfcFunction({
						variables: {
							input: {
								event: event.id,
								nfcId: nfc,
							},
						},
					});

					if (data)
						toastMsg = `${data.checkInUserToEventByNfc.firstName} ${data.checkInUserToEventByNfc.lastName} checked in`;
				}
			}
		}

		if (!toastMsg) throw new Error(`No user found`);

		toast.dismiss();
		toast.success(toastMsg, {
			autoClose: 2000,
			hideProgressBar: true,
			position: 'bottom-center',
			transition: cssTransition({ enter: 'none', exit: 'none', duration: 0 }),
		});
		return true;
	} catch (err) {
		toast.dismiss();
		toast.error(err.message, {
			autoClose: 3000,
			position: 'bottom-center',
			transition: cssTransition({ enter: 'none', exit: 'none', duration: 0 }),
		});
	}

	return false;
};
