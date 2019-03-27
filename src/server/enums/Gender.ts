import { registerEnumType } from 'type-graphql';

enum Gender {
	Male = 'Male',
	Female = 'Female',
	Other = 'Other',
	PreferNotToSay = 'Prefer not to say',
}

registerEnumType(Gender, {
	name: 'Gender',
});

export default Gender;
