import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';

class User extends Typegoose {
	@prop({ unique: true })
	nfcCodes?: string[];

	@prop()
	firstName?: string;

	@prop()
	lastName?: string;

	@prop({ required: true })
	email: string = '';

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
