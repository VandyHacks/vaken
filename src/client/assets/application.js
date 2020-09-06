import AutoComplete from '../components/Input/AutoCompleteTextInput';
import TextInput from '../components/Input/TextInput';
import { FileInput } from '../components/Input/FileInput';
import TextArea from '../components/Input/TextArea';
import { Checkbox, CheckboxSansTitleCase } from '../components/Input/Checkbox';
import { Slider, SliderSansTitleCase } from '../components/Input/Slider';
import Calendar from '../components/Input/Calendar';
import { Gender, ShirtSize, DietaryRestriction } from '../generated/graphql';
import { Boolean } from '../components/Input/Boolean';

export const questions = [
	{
		category: 'demographicInfo',
		fields: [
			{
				Component: TextInput,
				fieldName: 'firstName',
				placeholder: 'John',
				title: 'First Name',
			},
			{
				Component: TextInput,
				fieldName: 'preferredName',
				optional: true,
				placeholder: 'Jane',
				title: 'Preferred Name',
			},
			{
				Component: TextInput,
				fieldName: 'lastName',
				placeholder: 'Smith',
				title: 'Last Name',
			},
			{
				Component: Slider,
				fieldName: 'gender',
				optional: true,
				options: [Gender.Female, Gender.Male, Gender.Other, Gender.PreferNotToSay],
				other: true,
				sortOrder: 5,
				title: 'Gender',
			},
			// {
			// 	Component: Checkbox,
			// 	fieldName: 'dietaryRestrictions',
			// 	optional: true,
			// 	options: [
			// 		DietaryRestriction.GlutenFree,
			// 		DietaryRestriction.Vegetarian,
			// 		DietaryRestriction.Vegan,
			// 		DietaryRestriction.LactoseAllergy,
			// 		DietaryRestriction.NutAllergy,
			// 		DietaryRestriction.Halal,
			// 		DietaryRestriction.Kosher,
			// 	],
			// 	sortOrder: 6,
			// 	title: 'Dietary Restrictions',
			// },
			{
				Component: TextInput,
				fieldName: 'phoneNumber',
				placeholder: '(615) 555-1234',
				sortOrder: 3,
				title: 'Phone Number',
				type: 'tel',
				validation: '^(\\(?\\+?[0-9]*\\)?)?[0-9_\\- \\(\\)]*$',
			},
			{
				Component: Calendar,
				fieldName: 'dateOfBirth',
				placeholder: '01/01/2000',
				title: 'Date of Birth',
			},
			{
				Component: AutoComplete,
				fieldName: 'school',
				note: 'If not found, please type the name.',
				options: import('./data/institutions.json'),
				title: 'School',
			},
			{
				Component: AutoComplete,
				fieldName: 'major',
				options: import('./data/majors.json'),
				placeholder: 'If not found, please type the name.',
				title: 'What is your major area of study?',
			},
			{
				Component: Slider,
				default: '2019',
				fieldName: 'gradYear',
				options: ['2021', '2022', '2023', '2024', 'Other'],
				other: true,
				title: 'Graduation Year',
				type: 'number',
			},
			{
				Component: Checkbox,
				default: '',
				fieldName: 'race',
				note: 'Choose all that apply.',
				options: [
					'American Indian or Alaskan Native',
					'Asian',
					'Black or African American',
					'Hispanic',
					'White or Caucasian',
					'Native Hawaiian or Other Pacific Islander',
					'Other',
					'Prefer not to answer',
				],
				title: 'What is your race/ethnicity?',
			},
		],
		title: 'Demographic Information',
	},
	{
		category: 'application',
		fields: [
			{
				Component: Slider,
				default: '',
				fieldName: 'motivation',
				options: [
					'Get an intro to coding',
					'Create a project',
					'Have some fun with other people in the tech community',
					'Internship opportunities',
					'Other',
				],
				title: 'What do you hope to gain from VandyHacks?',
			},
			// {
			// 	Component: TextInput,
			// 	fieldName: 'favArtPiece',
			// 	note:
			// 		"This year's theme revolves around creativity and art. Put in your favorite work of art and you may see it used in our decor!",
			// 	title: 'Favorite work of art',
			// },
			// {
			// 	Component: TextArea,
			// 	fieldName: 'essay1',
			// 	note:
			// 		'Please write between 50 and 200 words. Your response will help us find creative, diverse attendees!',
			// 	title: 'What do you find beautiful?',
			// },
			// {
			// 	Component: Boolean,
			// 	fieldName: 'volunteer',
			// 	title: 'Would you like to be contacted about volunteering at the event?',
			// },
			{
				Component: Boolean,
				fieldName: 'lightningTalk',
				title:
					"Have something you'd really like to share at our event? Give a short five-minute talk!",
			},
			{
				Component: FileInput,
				fieldName: 'resume',
				note: 'Your resume will be shared with sponsors',
				title: 'Resume',
			},
			{
				Component: CheckboxSansTitleCase,
				fieldName: 'codeOfConduct',
				options: [
					'I have read and agree to the <a target="_blank" rel="noopener noreferrer" href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">MLH Code of Conduct</a>',
				],
				title: 'Code of Conduct',
			},
			{
				Component: CheckboxSansTitleCase,
				fieldName: 'hackathonWaiver',
				options: [
					'I have read and agree to the <a target="_blank" rel="noopener noreferrer" href="https://storage.googleapis.com/vh-fall-2020-assets/VHWAIVER.pdf"> VandyHacks VII Waiver</a>',
				],
				title: 'Hackathon Waiver',
			},
			{
				Component: CheckboxSansTitleCase,
				fieldName: 'infoSharingConsent',
				options: [
					'I authorize you to share my application/registration information for event administration, ranking, MLH administration, pre- and post-event informational emails, and occasional emails about hackathons in-line with the MLH Privacy Policy. I further agree to the terms of both the <a target="_blank" rel="noopener noreferrer" href="https://github.com/MLH/mlh-policies/tree/master/prize-terms-and-conditions">MLH Contest Terms and Conditions</a> and the <a target="_blank" rel="noopener noreferrer" href="https://mlh.io/privacy">MLH Privacy Policy</a>.',
				],
				title: 'Information sharing consent',
			},
		],
		title: 'Hacker Application',
	},
	{
		category: 'Shipping',
		fields: [
			{
				Component: TextInput,
				fieldName: 'address1',
				title: 'Address Line 1',
				note:
					'We use your address to ship swag. This is optional. Currently, we can only ship inside the US.',
				optional: true,
				placeholder: `The Wond'ry`,
			},
			{
				Component: SliderSansTitleCase,
				fieldName: 'shirtSize',
				optional: true,
				options: [ShirtSize.Xs, ShirtSize.S, ShirtSize.M, ShirtSize.L, ShirtSize.Xl, ShirtSize.Xxl],
				other: true,
				sortOrder: 4,
				title: 'T-Shirt Size',
			},
			{
				Component: TextInput,
				fieldName: 'address2',
				title: 'Address Line 2',
				optional: true,
				placeholder: '2414 Highland Avenue',
			},
			{
				Component: TextInput,
				fieldName: 'city',
				title: 'City',
				optional: true,
				placeholder: 'Nashville',
			},
			{
				Component: TextInput,
				fieldName: 'state',
				placeholder: 'Tennessee',
				optional: true,
				title: 'State',
			},
			{
				Component: TextInput,
				placeholder: '37235',
				fieldName: 'zip',
				optional: true,
				title: 'Zip',
			},
		],
		title: 'Shipping',
	},
	// {
	// 	category: 'travel',
	// 	fields: [
	// 		{
	// 			Component: Boolean,
	// 			fieldName: 'reimbursementRequired',
	// 			note: "Answering 'Yes' here does not guarantee any reimbursement",
	// 			optional: true,
	// 			title: 'Do you require travel reimbursement to get to VandyHacks?',
	// 		},
	// 		{
	// 			Component: Boolean,
	// 			fieldName: 'travelInfoSharingConsent',
	// 			note: 'Information will be shared to facilitate carpooling',
	// 			optional: true,
	// 			title: 'May we share your name and email with others coming from your school/city?',
	// 		},
	// 		{
	// 			Component: Slider,
	// 			fieldName: 'transportationMode',
	// 			optional: true,
	// 			options: ['Car', 'Bus', 'Plane', 'Blimp'],
	// 			title: 'How do you plan on getting to VandyHacks?',
	// 		},
	// 		{
	// 			Component: Boolean,
	// 			fieldName: 'travelAdmissionConsent',
	// 			note: "Please acknowledge this by clicking 'Yes'",
	// 			optional: true,
	// 			title:
	// 				'If you are purchasing a non-refundable ticket for long distance travel, we can offer guaranteed admission if you email info@vandyhacks.org along with a request and a receipt for your travel.',
	// 		},
	// 	],
	// 	title: 'Travel Reimbursement',
	// },
];

export const requiredFields = [
	'firstName',
	'lastName',
	// 'shirtSize',
	'phoneNumber',
	'dateOfBirth',
	'school',
	'major',
	'graduationYear',
	'race',
	// 'essay1',
	// 'volunteer',
	'consent',
	'hackathonWaiver',
	'address1',
	'city',
	'state',
	'zip',
];

export default questions;
