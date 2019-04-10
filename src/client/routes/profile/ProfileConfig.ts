// import AutoComplete from '../../components/Input/AutoCompleteTextInput';
import TextInput from '../../components/Input/TextInput';
import Checkbox from '../../components/Input/Checkbox';
import Slider from '../../components/Input/Slider';
import Boolean from '../../components/Input/Boolean';
// import Calendar from '../../components/Input/Calendar';

export const profile = [
	{
		Component: TextInput,
		fieldName: 'firstName',
		placeholder: 'Jane',
		title: 'First Name',
		validation: '.+',
	},
	{
		Component: TextInput,
		fieldName: 'lastName',
		placeholder: 'Smith',
		title: 'Last Name',
		validation: '.+',
	},
	{
		Component: TextInput,
		fieldName: 'phoneNumber',
		placeholder: '(615) 555-2689',
		title: 'Phone Number',
		validation: '^(\\(?\\+?[0-9]*\\)?)?[0-9_\\- \\(\\)]*$',
	},
	{
		Component: Slider,
		fieldName: 'shirtSize',
		optional: true,
		options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
		other: true,
		title: 'T-Shirt Size',
	},
	{
		Component: Boolean,
		default: false,
		fieldName: 'smsNotif',
		title: 'Would you like to receive sms notifications?',
	},
	{
		Component: Slider,
		fieldName: 'gender',
		optional: true,
		options: ['Male', 'Female', 'Other', 'N/A'],
		other: true,
		title: 'Gender',
	},
	{
		Component: Checkbox,
		fieldName: 'dietaryRestrictions',
		optional: true,
		options: ['Vegan', 'Vegetarian', 'Gluten Free', 'Paleo'],
		title: 'Dietary Restrictions',
	},
];

export default profile;
