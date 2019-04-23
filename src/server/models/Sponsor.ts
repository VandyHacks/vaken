import { prop, arrayProp, Ref, Typegoose } from 'typegoose';
import { SponsorRep } from './SponsorRep';

class Sponsor extends Typegoose {
	@prop({ unique: true })
	public name: string = '';

	@arrayProp({ itemsRef: SponsorRep })
	public sponsorReps?: Ref<SponsorRep>[];

	@prop({ ref: SponsorRep })
	public leadRep?: Ref<SponsorRep>;

	@prop()
	public tier?: string;

	@prop()
	public givingWorkshop?: boolean;

	@prop()
	public givingLightningTalk?: boolean;

	@prop()
	public workshopInfo?: string;

	@prop()
	public lightningTalkInfo?: string;
}

const sponsorModel = new Sponsor().getModelForClass(Sponsor);

export { Sponsor, sponsorModel };
