import institutions from './data/institutions.json';
import AutoCompletingText from '../components/Input/AutoCompleteTextInput';

module.exports = [
	{
		fields: [
			{
				component: 'input',
				name: 'firstName',
				placeholder: 'John',
				required: true,
				title: 'First Name',
				validation: '^(?!\\s*$).+',
			},
			{
				component: 'input',
				name: 'lastName',
				placholder: 'Smith',
				required: true,
				title: 'Last Name',
				validation: '^.{4,}$',
			},
			{
				component: 'input',
				name: 'dateOfBirth',
				placeholder: '01/01/2000',
				title: 'Date of Birth',
				type: 'date',
			},
			{
				component: 'slider',
				defaultValue: 2019,
				name: 'graduationYear',
				options: ['2019', '2020', '2021', '2022'],
				title: 'Graduation Year',
				type: 'number',
			},
			{
				component: 'toggle',
				defaultValue: true,
				name: 'ethnicity',
				prompt: 'Are you Spanish, Hispantic, or Latino?',
				title: 'Ethnicity',
			},
			{
				component: 'checkbox',
				instruction: 'Choose all that apply.',
				name: 'race',
				options: [
					'American Indian or Alaskan Native',
					'Asian',
					'Black or African American',
					'White or Caucasian',
					'Native Hawaiian or Other Pacific Islander',
					'Other',
				],
				title: 'Race',
			},
		],
		name: 'Demographic',
		title: 'Demographic',
	},
	{
		fields: [
			{
				input: AutoCompletingText,
				name: 'school',
				options: institutions,
				// placeholder: 'If not found, please type the name.',
				title: 'School',
			},
		],
		name: 'education',
		title: 'Education',
	},
];
