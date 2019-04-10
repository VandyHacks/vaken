import { Field, InputType, ArgsType } from 'type-graphql';
import User from '../data/User';
import AuthLevel from '../enums/AuthLevel';
import Gender from '../enums/Gender';
import ShirtSize from '../enums/ShirtSize';

@InputType()
class UpdateUserInput implements Partial<User> {
	@Field({ nullable: true })
	public authLevel?: AuthLevel;

	@Field({ nullable: true })
	public dietaryRestrictions?: string;

	@Field({ nullable: true })
	public firstName?: string;

	@Field({ nullable: true })
	public gender?: Gender;

	@Field({ nullable: true })
	public githubId?: string;

	@Field({ nullable: true })
	public googleId?: string;

	@Field({ nullable: true })
	public lastName?: string;

	@Field({ nullable: true })
	public newNfcCode?: string;

	@Field({ nullable: true })
	public phoneNumber?: string;

	@Field({ nullable: true })
	public shirtSize?: ShirtSize;
}

export default UpdateUserInput;
