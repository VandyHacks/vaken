import { CHECK_IN_EVENT_TYPE } from '../client/routes/nfc/helpers';
import {
	ApplicationStatus,
	Company,
	DietaryRestriction,
	Event,
	Gender,
	Hacker,
	LoginProvider,
	Race,
	ShirtSize,
	UserType,
	Sponsor,
	Tier,
	SponsorStatus,
} from '../client/generated/graphql';

const tabeHackerId = '12345';
const createdAt = new Date(2021, 1, 1).getTime();
const userId = { id: tabeHackerId } as Hacker;

export const MOCK_HACKER: Hacker = {
	__typename: 'Hacker',
	id: tabeHackerId,
	createdAt,
	dietaryRestrictions: [DietaryRestriction.GlutenFree, DietaryRestriction.LactoseAllergy].join('|'),
	email: 'email@email.com',
	firstName: 'Tabriel',
	lastName: 'Ging',
	emailUnsubscribed: false,
	eventScore: 0,
	eventsAttended: [],
	majors: ['Computer Science'],
	modifiedAt: new Date(2021, 2, 1).getTime(),
	preferredName: 'Tabe',
	race: [Race.Asian, Race.NativeHawaiianPacificIslander].join('|'),
	secondaryIds: ['54321'],
	logins: [
		{
			createdAt: new Date(2021, 1, 1).getTime(),
			provider: LoginProvider.Github,
			token: '0987654321',
			userType: UserType.Hacker,
		},
	],
	status: ApplicationStatus.Submitted,
	userType: UserType.Hacker,
	adult: true,
	gender: Gender.Male,
	github: 'github.com/VandyHacks',
	gradYear: '2022',
	phoneNumber: '7777777777',
	school: 'Vanderbilt University',
	shirtSize: ShirtSize.M,
	team: {
		createdAt: new Date(2021, 1, 1).getTime(),
		id: '123',
		size: 1,
		memberIds: [tabeHackerId],
		name: 'My Team Name',
	},
	volunteer: 'No',
	application: [
		{ id: '1', createdAt, userId, question: 'firstName', answer: 'Tabriel' },
		{ id: '2', createdAt, userId, question: 'lastName', answer: 'Ging' },
		{ id: '3', createdAt, userId, question: 'phoneNumber', answer: '3215551234' },
		{ id: '4', createdAt, userId, question: 'address1', answer: 'A Fake Address' },
		{ id: '5', createdAt, userId, question: 'address2', answer: 'Apt. 1' },
		{ id: '6', createdAt, userId, question: 'city', answer: 'A Fake Town' },
		{ id: '7', createdAt, userId, question: 'state', answer: 'AK' },
		{ id: '8', createdAt, userId, question: 'zip', answer: '12345' },
		{ id: '9', createdAt, userId, question: 'gender', answer: 'MALE' },
		{ id: '10', createdAt, userId, question: 'dateOfBirth', answer: '2001-02-03' },
		{ id: '11', createdAt, userId, question: 'school', answer: 'Vanderbilt University' },
		{ id: '12', createdAt, userId, question: 'major', answer: 'Computer Science' },
		{ id: '13', createdAt, userId, question: 'gradYear', answer: '2022' },
		{ id: '14', createdAt, userId, question: 'race', answer: 'Asian|Other' },
		{ id: '15', createdAt, userId, question: 'motivation', answer: 'Other' },
		{ id: '16', createdAt, userId, question: 'lightningTalk', answer: 'No' },
		{ id: '17', createdAt, userId, question: 'resume', answer: '5f4a72f3a78f3a00173ceb8c' },
		{ id: '18', createdAt, userId, question: 'shirtSize', answer: 'M' },
		{
			id: '19',
			createdAt,
			userId,
			question: 'codeOfConduct',
			answer:
				'I have read and agree to the <a target="_blank" rel="noopener noreferrer" href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">MLH Code of Conduct</a>',
		},
		{
			id: '20',
			createdAt,
			userId,
			question: 'hackathonWaiver',
			answer:
				'I have read and agree to the <a target="_blank" rel="noopener noreferrer" href="https://storage.googleapis.com/vh-fall-2020-assets/VHWAIVER.pdf"> VandyHacks VII Waiver</a>',
		},
		{
			id: '21',
			createdAt,
			userId,
			question: 'infoSharingConsent',
			answer:
				'I authorize you to share my application/registration information for event administration, ranking, MLH administration, pre- and post-event informational emails, and occasional emails about hackathons in-line with the MLH Privacy Policy. I further agree to the terms of both the <a target="_blank" rel="noopener noreferrer" href="https://github.com/MLH/mlh-policies/tree/master/prize-terms-and-conditions">MLH Contest Terms and Conditions</a> and the <a target="_blank" rel="noopener noreferrer" href="https://mlh.io/privacy">MLH Privacy Policy</a>.',
		},
	],
};

export const MOCK_HACKER_2: Hacker = {
	...MOCK_HACKER,
	firstName: 'Latt',
	lastName: 'Meon',
	id: '1234',
};

export const MOCK_HACKERS: Hacker[] = [
	MOCK_HACKER,
	MOCK_HACKER_2,
	{ ...MOCK_HACKER, status: ApplicationStatus.Confirmed, id: '70' },
	{ ...MOCK_HACKER_2, status: ApplicationStatus.Rejected, id: '71' },
	{ ...MOCK_HACKER, status: ApplicationStatus.Accepted, id: '72' },
	{ ...MOCK_HACKER_2, status: ApplicationStatus.Submitted, id: '73' },
	{ ...MOCK_HACKER, status: ApplicationStatus.Accepted, id: '74' },
	{ ...MOCK_HACKER_2, status: ApplicationStatus.Submitted, id: '75' },
];

export const MOCK_CHECK_IN_EVENT: Event = {
	__typename: 'Event',
	attendees: [tabeHackerId],
	checkins: [{ user: tabeHackerId, id: '999', timestamp: new Date(2021, 3, 1).getTime() }],
	duration: 3600,
	eventType: CHECK_IN_EVENT_TYPE,
	id: '888',
	startTimestamp: new Date().getTime(), // Always display this event.
	location: 'Atrium',
	warnRepeatedCheckins: true,
	name: 'Check In',
	description: 'Check in event',
	eventScore: 20,
	owner: null,
};

export const MOCK_SPONSOR_CHECK_IN_EVENT: Event = {
	__typename: 'Event',
	attendees: [tabeHackerId],
	checkins: [{ user: tabeHackerId, id: '999', timestamp: new Date(2021, 3, 1).getTime() }],
	duration: 3600,
	eventType: CHECK_IN_EVENT_TYPE,
	id: '889',
	startTimestamp: new Date(2021, 3, 1).getTime(),
	location: 'Atrium',
	warnRepeatedCheckins: true,
	name: 'Favorite Sponsor Check In',
	description: 'Check in with Our Favorite Sponsor',
	eventScore: 30,
};

export const MOCK_TIER: Tier = {
	name: 'Ultimate',
	id: '1',
	permissions: ['nfc'],
	__typename: 'Tier',
};

export const MOCK_COMPANY: Company = {
	tier: MOCK_TIER,
	id: '133',
	name: 'Our Favorite Sponsor',
	eventsOwned: [MOCK_SPONSOR_CHECK_IN_EVENT.id],
};

export const MOCK_SPONSOR_REP: Sponsor = {
	firstName: 'Cen',
	lastName: 'Booper',
	company: MOCK_COMPANY,
	createdAt: new Date(2021, 3, 2).getTime(),
	email: 'email@company.com',
	id: '14141',
	userType: UserType.Sponsor,
	secondaryIds: [],
	emailUnsubscribed: false,
	logins: [],
	preferredName: 'Cen',
	dietaryRestrictions: '',
	eventsAttended: [],
	status: SponsorStatus.Added,
};
