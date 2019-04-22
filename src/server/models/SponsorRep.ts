import { prop, arrayProp, Ref, Typegoose } from 'typegoose';
import { User } from './User';
import { Sponsor } from './Sponsor';

class SponsorRep extends Typegoose {
	@prop({ ref: User, required: true })
	public user!: Ref<User>;

	@prop({ required: true })
	public email: string = '';

	@arrayProp({ itemsRef: Sponsor, required: true })
	public sponsors: Ref<Sponsor>[] = [];

	@prop()
	public title?: string;

	@prop()
	public leadRep?: boolean;
}

const SponsorRepModel = new SponsorRep().getModelForClass(SponsorRep);

export { SponsorRep, SponsorRepModel };

// Copyright (c) 2019 Vanderbilt University
