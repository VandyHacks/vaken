import institutions from './data/institutions.json';
import AutoComplete from '../components/Input/AutoCompleteTextInput';
import TextInput from '../components/Input/TextInput';
import Checkbox from '../components/Input/Checkbox';

export const questions = [
	{
		category: 'demographicInfo',
		fields: [
			{
				Component: TextInput,
				fieldName: 'firstName',
				placeholder: 'John',
				required: true,
				title: 'First Name',
				validation: '^(?!\\s*$).+',
			},
			{
				Component: TextInput,
				fieldName: 'lastName',
				placholder: 'Smith',
				required: true,
				title: 'Last Name',
				validation: '^.{4,}$',
			},
			{
				Component: TextInput,
				fieldName: 'dateOfBirth',
				placeholder: '01/01/2000',
				required: false,
				title: 'Date of Birth',
			},
			{
				Component: TextInput,
				default: 2019,
				fieldName: 'graduationYear',
				options: ['2019', '2020', '2021', '2022'],
				title: 'Graduation Year',
				type: 'number',
			},
			{
				Component: TextInput,
				default: true,
				fieldName: 'ethnicity',
				prompt: 'Are you Spanish, Hispantic, or Latino?',
				title: 'Ethnicity',
			},
			{
				Component: Checkbox,
				fieldName: 'race',
				note: 'Choose all that apply.',
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
		title: 'Demographic',
	},
	{
		category: 'education',
		fields: [
			{
				Component: AutoComplete,
				fieldName: 'school',
				options: institutions,
				placeholder: 'If not found, please type the name.',
				title: 'School',
			},
		],
		title: 'Education',
	},
];

export default questions;
