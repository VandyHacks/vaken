import { pre, prop, arrayProp, Typegoose, ModelType, InstanceType } from 'typegoose';
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
	email: string = '';

	// not unique for now to make testing easier
	@arrayProp({ items: String })
	nfcCodes?: string[];

	@prop({ required: true })
	password: string = '';

	@prop()
	firstName?: string;

	@prop()
	lastName?: string;

	@prop({ sparse: true, unique: true })
	google?: string;

	@prop({ sparse: true, unique: true })
	github?: string;

	@prop({ required: true })
	authType: string = 'None';

	@prop({ required: true })
	authLevel: string = 'Hacker';

	@prop()
	phoneNumber?: string;

	@prop()
	gender?: string;

	@prop()
	shirtSize?: string;

	@prop()
	dietaryRestrictions?: string;
}

const userModel = new User().getModelForClass(User);

export { User, userModel };

// Copyright (c) 2019 Vanderbilt University
