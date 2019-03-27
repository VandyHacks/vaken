import { registerEnumType } from 'type-graphql';

export enum Race {
	White = 'White',
	BlackOrAfricanAmerican = 'Black or African-American',
	AmericanIndianOrAlaskaNative = 'American Indian or Alaska Native',
	Asian = 'Asian',
	NativeHawaiianOrPacificIslander = 'Native Hawaiian or Pacific Islander',
}

registerEnumType(Race, {
	name: 'Race',
});
