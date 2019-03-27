import { prop, arrayProp, Ref, Typegoose } from 'typegoose';
import { SponsorRep } from './SponsorRep';

class Sponsor extends Typegoose {
	@prop({ unique: true })
	private name: string = '';

	@arrayProp({ itemsRef: SponsorRep })
	private sponsorReps?: Ref<SponsorRep>[];

	@prop({ ref: SponsorRep })
	private leadRep?: Ref<SponsorRep>;

	@prop()
	private tier?: string;

	@prop()
	private givingWorkshop?: boolean;

	@prop()
	private givingLightningTalk?: boolean;

	@prop()
	private workshopInfo?: string;

	@prop()
	private lightningTalkInfo?: string;
}

const sponsorModel = new Sponsor().getModelForClass(Sponsor);

export { Sponsor, sponsorModel };

// Copyright (c) 2019 Vanderbilt University
