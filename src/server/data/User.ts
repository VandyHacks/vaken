import 'reflect-metadata';
import { Field, ObjectType, Int, Float } from 'type-graphql';

import { ShirtSize } from '.../enums/ShirtSize

/**
 * TODO - build explicit constructor (can I just set default values?)
 * TODO - enforce uniqueness as necessary
 * TODO - enforce required vs optional status as necessary
 */
@ObjectType({ description: 'DTO for a generic Vaken user' })
export class User {
	@Field(type => [String])
	nfcCodes!: String[];

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

	@Field(type => String)
	gender!: String; // TODO - make this an enum

	@Field(type => ShirtSize)
	shirtSize!: ShirtSize;

	@Field(type => String)
	dietaryRestrictions?: String;
}
