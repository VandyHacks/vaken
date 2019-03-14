import { registerEnumType } from 'type-graphql';

export enum Race {
	White,
	BlackOrAfricanAmerican,
	AmericanIndianOrAlaskaNative,
	Asian,
	NativeHawaiianOrPacificIslander,
}

registerEnumType(Race, {
	name: 'Race',
});
