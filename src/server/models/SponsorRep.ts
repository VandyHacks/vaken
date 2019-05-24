import { prop, arrayProp, Ref, Typegoose } from 'typegoose';
import { User } from './User';

class SponsorRep extends Typegoose {
	@prop({ ref: User, required: true })
	public user!: Ref<User>;

	@prop({ required: true })
	public email!: string;

	@arrayProp({ items: String, required: true })
	public sponsors: string[] = [];

	@prop()
	public title?: string;

	@prop()
	public leadRep?: boolean;
}

const SponsorRepModel = new SponsorRep().getModelForClass(SponsorRep);

export { SponsorRep, SponsorRepModel };
