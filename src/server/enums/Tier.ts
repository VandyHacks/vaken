import { registerEnumType } from 'type-graphql';

export enum Tier {
	Bronze,
	Silver,
	Ruby,
	Sapphire,
	CommodoreGold,
	Custom,
}

registerEnumType(Tier, {
	name: 'Tier',
});
