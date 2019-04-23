import { registerEnumType } from 'type-graphql';

enum Tier {
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

export default Tier;
