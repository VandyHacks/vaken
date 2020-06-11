// import AutoComplete from '../../components/Input/AutoCompleteTextInput';
import { Gender, ShirtSize, DietaryRestriction } from '../../generated/graphql';
import { Input as TextInput } from '../../components/Input/TextInput';
import { Checkbox } from '../../components/Input/Checkbox';
import { Slider, SliderShirtSizes } from '../../components/Input/Slider';
// import { Boolean } from '../../components/Input/Boolean';
// import Calendar from '../../components/Input/Calendar';

export const profile = [
	{
		Component: TextInput,
		fieldName: 'firstName',
		placeholder: 'Janet',
		sortOrder: 0,
		title: 'First Name',
		validation: '.+',
	},
	{
		Component: TextInput,
		fieldName: 'preferredName',
		placeholder: 'Jane',
		sortOrder: 1,
		title: 'Preferred Name',
		validation: '*',
	},
	{
		Component: TextInput,
		fieldName: 'lastName',
		placeholder: 'Smith',
		sortOrder: 2,
		title: 'Last Name',
		validation: '.+',
	},
	{
		Component: TextInput,
		fieldName: 'phoneNumber',
		placeholder: '(615) 555-1234',
		sortOrder: 3,
		title: 'Phone Number',
		validation: '^(\\(?\\+?[0-9]*\\)?)?[0-9_\\- \\(\\)]*$',
	},
	{
		Component: SliderShirtSizes,
		fieldName: 'shirtSize',
		optional: true,
		options: [
			ShirtSize.Xs,
			ShirtSize.S,
			ShirtSize.M,
			ShirtSize.L,
			ShirtSize.Xl,
			ShirtSize.Xxl,
			ShirtSize.WomensXs,
			ShirtSize.WomensS,
			ShirtSize.WomensM,
			ShirtSize.WomensL,
			ShirtSize.WomensXl,
			ShirtSize.WomensXxl,
		],
		other: true,
		sortOrder: 4,
		title: 'T-Shirt Size',
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
		sortOrder: 6,
		title: 'Dietary Restrictions',
	},
];

export default profile;
