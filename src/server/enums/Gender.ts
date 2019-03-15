import { registerEnumType } from 'type-graphql';

export enum Gender {
	Male,
	Female,
	Other,
	PreferNotToSay,
}

registerEnumType(Gender, {
	name: 'Gender',
});
