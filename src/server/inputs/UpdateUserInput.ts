import { Field, InputType, ArgsType } from 'type-graphql';
import User from '../data/User';
import AuthLevel from '../enums/AuthLevel';
import Gender from '../enums/Gender';
import ShirtSize from '../enums/ShirtSize';

@ArgsType()
@InputType()
class UpdateUserInput implements Partial<User> {
	@Field()
	public email!: string;

	@Field()
	public newNfcCode?: string;

	@Field()
	public firstName?: string;

	@Field()
	public lastName?: string;

	@Field()
	public googleId?: string;

	@Field()
	public githubId?: string;

	@Field()
	public authLevel?: AuthLevel;

	@Field()
	public phoneNumber?: string;

	@Field()
	public gender?: Gender;

	@Field()
	public shirtSize?: ShirtSize;

	@Field()
	public dietaryRestrictions?: string;
}

export default UpdateUserInput;
