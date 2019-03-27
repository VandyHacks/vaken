import { registerEnumType } from 'type-graphql';

enum DietaryRestrictions {
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

export default DietaryRestrictions;
