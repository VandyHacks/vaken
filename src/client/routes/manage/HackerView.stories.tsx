import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
	ApplicationStatus,
	DetailedHackerDocument,
	DetailedHackerQueryResult,
	ShirtSize,
	SignedReadUrlDocument,
	SignedReadUrlQueryResult,
	UserType,
} from '../../generated/graphql';
import { HackerViewProps, HackerView } from './HackerView';

const HACKER_ID = '12345';

const mocks: MockedResponse<
	DetailedHackerQueryResult['data'] | SignedReadUrlQueryResult['data']
>[] = [
	{
		request: { query: DetailedHackerDocument, variables: { id: HACKER_ID } },
		result: {
			data: {
				hacker: {
					id: '1234567890',
					email: 'anemail@gmail.com',
					firstName: 'Student',
					preferredName: '',
					lastName: 'Name',
					shirtSize: ShirtSize.M,
					gender: 'MALE',
					dietaryRestrictions: '',
					userType: UserType.Hacker,
					phoneNumber: '3215551234',
					race: 'Asian',
					modifiedAt: 1598714611692,
					status: ApplicationStatus.Confirmed,
					school: 'Vanderbilt University',
					gradYear: '2021',
					majors: [],
					adult: null,
					volunteer: null,
					github: null,
					team: {
						id: '12345678901234567890',
						name: null,
						memberIds: [],
					},
					application: [
						{ question: 'firstName', answer: 'Student' },
						{ question: 'lastName', answer: 'Name' },
						{ question: 'phoneNumber', answer: '3215551234' },
						{ question: 'address1', answer: 'A Fake Address' },
						{ question: 'address2', answer: 'Apt. 1' },
						{ question: 'city', answer: 'A Fake Town' },
						{ question: 'state', answer: 'AK' },
						{ question: 'zip', answer: '12345' },
						{ question: 'gender', answer: 'MALE' },
						{ question: 'dateOfBirth', answer: '2001-02-03' },
						{ question: 'school', answer: 'Vanderbilt University' },
						{ question: 'major', answer: 'Computer Science' },
						{ question: 'gradYear', answer: '2021' },
						{ question: 'race', answer: 'Asian' },
						{ question: 'motivation', answer: 'Other' },
						{ question: 'lightningTalk', answer: 'No' },
						{ question: 'resume', answer: '5f4a72f3a78f3a00173ceb8c' },
						{ question: 'shirtSize', answer: 'M' },
						{
							question: 'codeOfConduct',
							answer:
								'I have read and agree to the <a target="_blank" rel="noopener noreferrer" href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">MLH Code of Conduct</a>',
						},
						{
							question: 'hackathonWaiver',
							answer:
								'I have read and agree to the <a target="_blank" rel="noopener noreferrer" href="https://storage.googleapis.com/vh-fall-2020-assets/VHWAIVER.pdf"> VandyHacks VII Waiver</a>',
						},
						{
							question: 'infoSharingConsent',
							answer:
								'I authorize you to share my application/registration information for event administration, ranking, MLH administration, pre- and post-event informational emails, and occasional emails about hackathons in-line with the MLH Privacy Policy. I further agree to the terms of both the <a target="_blank" rel="noopener noreferrer" href="https://github.com/MLH/mlh-policies/tree/master/prize-terms-and-conditions">MLH Contest Terms and Conditions</a> and the <a target="_blank" rel="noopener noreferrer" href="https://mlh.io/privacy">MLH Privacy Policy</a>.',
						},
					],
				},
			},
		},
	},
	{
		request: { query: SignedReadUrlDocument, variables: { input: '' } },
		result: {
			data: { signedReadUrl: '' },
		},
	},
	{
		request: { query: SignedReadUrlDocument, variables: { input: HACKER_ID } },
		result: {
			data: { signedReadUrl: 'https://vandyhacks.org' },
		},
	},
];

export default {
	title: 'Routes/Manage/Hacker Table/Hacker View',
	component: HackerView,
	decorators: [
		StoryComponent => (
			<MockedProvider mocks={mocks as MockedResponse[]}>
				<StoryComponent />
			</MockedProvider>
		),
	],
} as Meta;

export const WithFakeData: Story<HackerViewProps> = args => <HackerView {...args} />;
WithFakeData.args = {
	match: { params: { id: HACKER_ID } },
} as Partial<HackerViewProps>;
