import 'reflect-metadata';
import { Field, ObjectType, InputType } from 'type-graphql';

import AuthType from '../enums/AuthType';
import AuthLevel from '../enums/AuthLevel';
import ShirtSize from '../enums/ShirtSize';
import Gender from '../enums/Gender';

@ObjectType({ description: 'DTO for a generic Vaken user' })
@InputType()
export class User {
	@Field(type => [String])
	public nfcCodes!: [string];

	@Field()
	public firstName!: string;

	@Field()
	public lastName!: string;

	@Field()
	public email!: string;

	@Field()
	public google?: string;

	@Field()
	public github?: string;

	@Field()
	public authType!: AuthType;

	@Field()
	public authLevel!: AuthLevel;

	@Field()
	public phoneNumber!: string;

	@Field()
	public gender!: Gender;

	@Field()
	public shirtSize!: ShirtSize;

	@Field()
	public dietaryRestrictions?: string;
}

export default User;
