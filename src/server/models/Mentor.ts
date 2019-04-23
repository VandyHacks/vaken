import { arrayProp, prop, Ref, Typegoose } from 'typegoose';
import { User } from './User';

class Mentor extends Typegoose {
	@prop({ ref: User, required: true })
	public user!: Ref<User>;

	@prop({ required: true })
	public email!: string;

	@arrayProp({ items: String, required: true })
	public shifts?: string[];

	@arrayProp({ items: String, required: true })
	public skills?: string[];
}

const mentorModel = new Mentor().getModelForClass(Mentor);

export { Mentor, mentorModel };
