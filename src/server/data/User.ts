import 'reflect-metadata';
import { Field, ObjectType, InputType } from 'type-graphql';

import AuthType from '../enums/AuthType';
import AuthLevel from '../enums/AuthLevel';
import ShirtSize from '../enums/ShirtSize';
import Gender from '../enums/Gender';

@ObjectType({ description: 'DTO for a generic Vaken user' })
@InputType()
export class User {
	@Field()
	public email!: string;

	@Field(type => [String])
	public nfcCodes!: [string];

	@Field({ nullable: true })
	public firstName?: string;

	@Field({ nullable: true })
	public lastName?: string;

	@Field({ nullable: true })
	public google?: string;

	@Field({ nullable: true })
	public github?: string;

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

	@Field({ nullable: true })
	public dietaryRestrictions?: string;
}

export default User;
