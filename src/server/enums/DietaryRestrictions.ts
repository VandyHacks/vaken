import { registerEnumType } from 'type-graphql';

enum DietaryRestrictions {
	VEGETARIAN = 'Vegetarian',
	VEGAN = 'Vegan',
	NUTALLERGY = 'NutAllergy',
	LACTOSEALLERGY = 'LactoseAllergy',
	GLUTENFREE = 'GlutenFree',
	KOSHER = 'Kosher',
	HALAL = 'Halal',
}

registerEnumType(DietaryRestrictions, {
	name: 'DietaryRestrictions',
});

export default DietaryRestrictions;
