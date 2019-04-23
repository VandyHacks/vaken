import { registerEnumType } from 'type-graphql';

enum Gender {
	Male = 'Male',
	Female = 'Female',
	Other = 'Other',
	PreferNotToSay = 'PreferNotToSay',
}

registerEnumType(Gender, {
	name: 'Gender',
});

export default Gender;
