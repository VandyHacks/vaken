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
	private email: string = '';

	// not unique for now to make testing easier
	@arrayProp({ items: String })
	private nfcCodes?: string[];

	@prop({ required: true })
	private password: string = '';

	@prop()
	private firstName?: string;

	@prop()
	private lastName?: string;

	@prop({ sparse: true, unique: true })
	private google?: string;

	@prop({ sparse: true, unique: true })
	private github?: string;

	@prop({ required: true })
	private authType: string = 'None';

	@prop({ required: true })
	private authLevel: string = 'Hacker';

	@prop()
	private phoneNumber?: string;

	@prop()
	private gender?: string;

	@prop()
	private shirtSize?: string;

	@prop()
	private dietaryRestrictions?: string;
}

const userModel = new User().getModelForClass(User);

export { User, userModel };

// Copyright (c) 2019 Vanderbilt University
