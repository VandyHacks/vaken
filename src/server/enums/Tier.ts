import { registerEnumType } from 'type-graphql';

export enum Tier {
	Bronze = 'Bronze',
	Silver = 'Silver',
	Ruby = 'Ruby',
	Sapphire = 'Sapphire',
	CommodoreGold = 'CommodoreGold',
	Custom = 'Custom',
}

registerEnumType(Tier, {
	name: 'Tier',
});
