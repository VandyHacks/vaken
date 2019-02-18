import { prop, arrayProp, Typegoose, ModelType, InstanceType } from 'typegoose';

// Figure out how we want to handle user roles/auth
// enum UserRole {}

class User extends Typegoose {
	@arrayProp({ items: String, unique: true })
	nfcCodes?: string[];

	@prop()
	firstName?: string;

	@prop()
	lastName?: string;

	@prop({ required: true })
	email: string = '';

	@prop({ unique: true })
	google?: string;

	@prop({ unique: true })
	github?: string;

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
