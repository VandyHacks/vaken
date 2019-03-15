import { registerEnumType } from 'type-graphql';

export enum Ethnicity {
	HispanicOrLatino,
	NotHispanicOrLatino,
}

registerEnumType(Ethnicity, {
	name: 'Ethnicity',
});
