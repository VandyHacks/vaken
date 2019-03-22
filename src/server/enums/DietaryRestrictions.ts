import { registerEnumType } from 'type-graphql';

export enum DietaryRestrictions {
	VEGETARIAN = 'Vegetarian',
	VEGAN = 'Vegan',
	NUTALLERGY = 'Nut Allergy',
	LACTOSEALLERGY = 'Lactose Allergy',
	GLUTENFREE = 'Gluten Free',
	KOSHER = 'Kosher',
	HALAL = 'Halal',
}

registerEnumType(DietaryRestrictions, {
	name: 'DietaryRestrictions',
});
