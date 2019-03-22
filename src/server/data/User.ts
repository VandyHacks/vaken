import 'reflect-metadata';
import { Field, ObjectType, InputType } from 'type-graphql';

import { AuthLevel } from '../enums/AuthLevel';
import { ShirtSize } from '../enums/ShirtSize';
import { Gender } from '../enums/Gender';

@ObjectType({ description: 'DTO for a generic Vaken user' })
@InputType()
export class User {
	@Field(type => [String])
	nfcCodes!: [string];

	@Field()
	firstName!: string;

	@Field()
	lastName!: string;

	@Field()
	email!: string;

	@Field()
	google?: string;

	@Field()
	github?: string;

	@Field()
	authType!: string;

	@Field()
	authLevel!: AuthLevel;

	@Field()
	phoneNumber!: string;

	@Field()
	gender!: Gender;

	@Field()
	shirtSize!: ShirtSize;

	@Field()
	dietaryRestrictions?: string;
}
