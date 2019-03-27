import { pre, prop, arrayProp, Typegoose } from 'typegoose';
import bcrypt from 'bcrypt';

const saltRounds = 10;

@pre<User>('save', function(next) {
	const user = this;
	if (!user.isModified('password')) {
		return next();
	}
	bcrypt.genSalt(saltRounds, (err, salt) => {
		if (err) {
			return next();
		}
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
	public google?: string;

	@prop({ sparse: true, unique: true })
	public github?: string;

	@prop({ required: true })
	public authType: string = 'None';

	@prop({ required: true })
	public authLevel: string = 'Hacker';

	@prop()
	public phoneNumber?: string;

	@prop()
	public gender?: string;

	@prop()
	public shirtSize?: string;

	@prop()
	public dietaryRestrictions?: string;
}

const userModel = new User().getModelForClass(User);

export { User, userModel };

// Copyright (c) 2019 Vanderbilt University
