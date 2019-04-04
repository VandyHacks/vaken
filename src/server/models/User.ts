import { pre, prop, arrayProp, Typegoose } from 'typegoose';
import bcrypt from 'bcrypt';
import AuthType from '../enums/AuthType';
import AuthLevel from '../enums/AuthLevel';
import ShirtSize from '../enums/ShirtSize';
import Gender from '../enums/Gender';

const saltRounds = 10;

@pre<User>('save', next => {
	const user = this;

	if (!user.isModified('password')) {
		return next();
	}

	bcrypt.genSalt(saltRounds, (err, salt) => {
		if (err) {
			return next();
		}
		// eslint-disable-next-line no-shadow
		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) {
				return next();
			}

			user.password = hash;
			next();
		});
	});
})
class User extends Typegoose {
	@prop({ required: true })
	public email: string = '';

	// not unique for now to make testing easier
	@arrayProp({ items: String })
	public nfcCodes?: string[];

	@prop({ required: true })
	public password: string = '';

	@prop()
	public firstName?: string;

	@prop()
	public lastName?: string;

	@prop({ sparse: true, unique: true })
	public googleId?: string;

	@prop({ sparse: true, unique: true })
	public githubId?: string;

	@prop({ required: true })
	public authType!: AuthType;

	@prop({ required: true })
	public authLevel!: AuthLevel;

	@prop()
	public phoneNumber?: string;

	@prop()
	public gender?: Gender;

	@prop()
	public shirtSize?: ShirtSize;

	@prop()
	public dietaryRestrictions?: string;
}

const UserModel = new User().getModelForClass(User);

export { User, UserModel };

// Copyright (c) 2019 Vanderbilt University
