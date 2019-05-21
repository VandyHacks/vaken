import 'reflect-metadata';
import { ObjectType, Field } from 'type-graphql';

import Gender from '../enums/Gender';

@ObjectType({ description: 'DTO for a count of hacker genders' })
export default class HackerGenders {
	@Field()
	public [Gender.Male]: number = 0;

	@Field()
	public [Gender.Female]: number = 0;

	@Field()
	public [Gender.Other]: number = 0;

	@Field()
	public [Gender.PreferNotToSay]: number = 0;

	@Field()
	public UNKNOWN: number = 0;
}
