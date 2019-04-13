import institutions from './data/institutions.json';
import AutoComplete from '../components/Input/AutoCompleteTextInput';
import TextInput from '../components/Input/TextInput';
import Checkbox from '../components/Input/Checkbox';
import Slider from '../components/Input/Slider';
import Boolean from '../components/Input/Boolean';
import Calendar from '../components/Input/Calendar';

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
				fieldName: 'lastName',
				placeholder: 'Smith',
				title: 'Last Name',
			},
			{
				Component: Calendar,
				fieldName: 'dateOfBirth',
				placeholder: '01/01/2000',
				required: false,
				title: 'Date of Birth',
			},
			{
				Component: Slider,
				default: 2019,
				fieldName: 'graduationYear',
				optional: true,
				options: [2019, 2020, 2021, 2022],
				other: true,
				title: 'Graduation Year',
				type: 'number',
			},
			{
				Component: Boolean,
				default: false,
				fieldName: 'ethnicity',
				prompt: 'Are you Spanish, Hispanic, or Latino?',
				title: 'Ethnicity',
			},
			{
				Component: Checkbox,
				default: new Set(),
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
