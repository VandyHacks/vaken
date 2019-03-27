import { registerEnumType } from 'type-graphql';

export enum Ethnicity {
	HispanicOrLatino = 'Hispanic or Latino',
	NotHispanicOrLatino = 'Not Hispanic or Latino',
}

registerEnumType(Ethnicity, {
	name: 'Ethnicity',
});
