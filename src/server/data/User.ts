import 'reflect-metadata';
import { Field, ObjectType, InputType } from 'type-graphql';

import { ShirtSize } from '../enums/ShirtSize';
import { Gender } from '../enums/Gender';

@ObjectType({ description: 'DTO for a generic Vaken user' })
@InputType()
export class User {
	@Field(type => [String])
	nfcCodes!: [String];

	@Field(type => String)
	firstName!: String;

	@Field(type => String)
	lastName!: String;

	@Field(type => String)
	email!: String;

	@Field(type => String)
	google?: String;

	@Field(type => String)
	github?: String;

	@Field(type => String)
	phoneNumber!: String;

	@Field(type => Gender)
	gender!: Gender;

	@Field(type => ShirtSize)
	shirtSize!: ShirtSize;

	@Field(type => String)
	dietaryRestrictions?: String;
}
