import 'reflect-metadata';
import { Field, ObjectType } from 'type-graphql';

import AuthType from '../enums/AuthType';
import AuthLevel from '../enums/AuthLevel';
import Gender from '../enums/Gender';
import ShirtSize from '../enums/ShirtSize';
import DietaryRestrictions from '../enums/DietaryRestrictions';

@ObjectType({ description: 'DTO for a generic Vaken user' })
export default class User {
	@Field()
	public email!: string;

	@Field(() => [String])
	public nfcCodes?: string[];

	@Field(() => String, { nullable: true })
	public firstName?: string;

	@Field(() => String, { nullable: true })
	public lastName?: string;

	@Field({ nullable: true })
	public googleId?: string;

	@Field({ nullable: true })
	public githubId?: string;

	@Field()
	public authType!: AuthType;

	@Field()
	public authLevel!: AuthLevel;

	@Field({ nullable: true })
	public phoneNumber?: string;

	@Field({ nullable: true })
	public gender?: Gender;

	@Field({ nullable: true })
	public shirtSize?: ShirtSize;

	@Field(() => [DietaryRestrictions], { nullable: true })
	public dietaryRestrictions?: [DietaryRestrictions];
}
