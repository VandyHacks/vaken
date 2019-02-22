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
	nfcCodes!: string[];

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
	phoneNumber!: string;

	@Field()
	gender!: string;

	@Field()
	shirtSize!: string;

	@Field()
	dietaryRestrictions?: string;
}
