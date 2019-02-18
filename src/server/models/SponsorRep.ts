import { prop, arrayProp, Ref, Typegoose } from 'typegoose';
import { User } from './User';
import { Sponsor } from './Sponsor';

class SponsorRep extends User {
	@arrayProp({ itemsRef: Sponsor, required: true })
	sponsors: Ref<Sponsor>[] = [];

	@prop()
	title?: string;

	@prop()
	leadRep?: boolean;
}

const sponsorRepModel = new SponsorRep().getModelForClass(SponsorRep);

export { SponsorRep, sponsorRepModel };

// Copyright (c) 2019 Vanderbilt University
