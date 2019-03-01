import 'reflect-metadata';
import { Field, ObjectType, Int, Float } from 'type-graphql';

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

	@Field()
	lastName!: String;

	@Field()
	email!: String;

	@Field()
	google?: String;

	@Field()
	github?: String;

	@Field()
	phoneNumber!: String; // TODO - make this typed

	@Field()
	gender!: String; // TODO - make this an enum

	@Field()
	shirtSize!: String; // TODO - make this an enum

	@Field()
	dietaryRestrictions?: String;
}
