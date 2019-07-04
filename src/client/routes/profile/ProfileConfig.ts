// import AutoComplete from '../../components/Input/AutoCompleteTextInput';
import { Gender, ShirtSize, DietaryRestriction } from '../../generated/graphql';
import { Input as TextInput } from '../../components/Input/TextInput';
import { Checkbox } from '../../components/Input/Checkbox';
import { Slider } from '../../components/Input/Slider';
import { Boolean } from '../../components/Input/Boolean';
// import Calendar from '../../components/Input/Calendar';

export const profile = [
	{
		Component: TextInput,
		fieldName: 'firstName',
		placeholder: 'Janet',
		title: 'First Name',
		validation: '.+',
	},
	{
		Component: TextInput,
		fieldName: 'preferredName',
		placeholder: 'Jane',
		title: 'Preferred Name',
		validation: '*',
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
		placeholder: '(615) 555-1234',
		title: 'Phone Number',
		validation: '^(\\(?\\+?[0-9]*\\)?)?[0-9_\\- \\(\\)]*$',
	},
	{
		Component: Slider,
		fieldName: 'shirtSize',
		optional: true,
		options: [
			ShirtSize.Uxs,
			ShirtSize.Us,
			ShirtSize.Um,
			ShirtSize.Ul,
			ShirtSize.Uxl,
			ShirtSize.Uxxl,
			ShirtSize.Ws,
			ShirtSize.Wm,
			ShirtSize.Wl,
			ShirtSize.Wxl,
			ShirtSize.Wxxl,
		],
		other: true,
		title: 'T-Shirt Size',
	},
	{
		Component: Slider,
		fieldName: 'gender',
		optional: true,
		options: [Gender.Female, Gender.Male, Gender.Other, Gender.PreferNotToSay],
		other: true,
		title: 'Gender',
	},
	{
		Component: Checkbox,
		fieldName: 'dietaryRestrictions',
		optional: true,
		options: [
			DietaryRestriction.GlutenFree,
			DietaryRestriction.Vegetarian,
			DietaryRestriction.Vegan,
			DietaryRestriction.LactoseAllergy,
			DietaryRestriction.NutAllergy,
			DietaryRestriction.Halal,
			DietaryRestriction.Kosher,
		],
		title: 'Dietary Restrictions',
	},
];

export default profile;
