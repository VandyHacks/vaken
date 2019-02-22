import {
	Resolver,
	Query,
	FieldResolver,
	Arg,
	Root,
	Mutation,
	Float,
	Int,
	ResolverInterface,
} from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { Recipe } from '../data/Recipe';

@Resolver(of => Recipe)
export class RecipeResolver implements ResolverInterface<Recipe> {
	private readonly items: Recipe[] = createRecipeSamples();

	@Query(returns => Recipe, { nullable: true })
	async recipe(@Arg('title') title: string): Promise<Recipe | undefined> {
		return await this.items.find(recipe => recipe.title === title);
	}

	@Query(returns => [Recipe], { description: 'Get all the recipes from around the world ' })
	async recipes(): Promise<Recipe[]> {
		return await this.items;
	}

	// @Mutation(returns => Recipe)
	// async addRecipe(@Arg('recipe') recipeInput: RecipeInput): Promise<Recipe> {
	// 	const recipe = plainToClass(Recipe, {
	// 		description: recipeInput.description,
	// 		title: recipeInput.title,
	// 		ratings: [],
	// 		creationDate: new Date(),
	// 	});
	// 	await this.items.push(recipe);
	// 	return recipe;
	// }

	@FieldResolver()
	ratingsCount(
		@Root() recipe: Recipe,
		@Arg('minRate', type => Int, { defaultValue: 0.0 }) minRate: number
	): number {
		return recipe.ratings.filter(rating => rating >= minRate).length;
	}
}

let createRecipeSamples = () => {
	return plainToClass(Recipe, [
		{
			description: 'Desc 1',
			title: 'Recipe 1',
			ratings: [0, 3, 1],
			creationDate: new Date('2018-04-11'),
		},
		{
			description: 'Desc 2',
			title: 'Recipe 2',
			ratings: [4, 2, 3, 1],
			creationDate: new Date('2018-04-15'),
		},
		{
			description: 'Desc 3',
			title: 'Recipe 3',
			ratings: [5, 4],
			creationDate: new Date(),
		},
	]);
};
