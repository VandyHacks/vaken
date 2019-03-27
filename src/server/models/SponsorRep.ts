import { prop, arrayProp, Ref } from 'typegoose';
import { User } from './User';
import { Sponsor } from './Sponsor';

class SponsorRep extends User {
	@arrayProp({ itemsRef: Sponsor, required: true })
	public sponsors: Ref<Sponsor>[] = [];

	@prop()
	public title?: string;

	@prop()
	public leadRep?: boolean;
}

const sponsorRepModel = new SponsorRep().getModelForClass(SponsorRep);

export { SponsorRep, sponsorRepModel };

// Copyright (c) 2019 Vanderbilt University
