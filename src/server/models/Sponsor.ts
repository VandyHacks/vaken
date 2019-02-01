import { prop, arrayProp, Ref, Typegoose, ModelType, InstanceType } from 'typegoose';
import { SponsorRep } from './SponsorRep';

class Sponsor extends Typegoose {
	@prop({ unique: true })
	name: string = '';

	@arrayProp({ itemsRef: SponsorRep })
	sponsorReps?: Ref<SponsorRep>[];

	@prop({ ref: SponsorRep })
	leadRep?: Ref<SponsorRep>;

	@prop()
	tier?: string;

	@prop()
	givingWorkshop?: boolean;

	@prop()
	givingLightningTalk?: boolean;

	@prop()
	workshopInfo?: string;

	@prop()
	lightningTalkInfo?: string;
}

const sponsorModel = new Sponsor().getModelForClass(Sponsor);

export { Sponsor, sponsorModel };
