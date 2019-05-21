import 'reflect-metadata';
import { Field, ObjectType, InputType } from 'type-graphql';

import SponsorRep from './SponsorRep';
import Tier from '../enums/Tier';

@ObjectType({ description: 'DTO for a Vaken sponsor' })
@InputType()
export default class Sponsor {
	@Field()
	public name: string = '';

	@Field(() => [SponsorRep])
	public sponsorReps?: SponsorRep[];

	@Field(() => [SponsorRep])
	public leadRep?: SponsorRep[];

	@Field()
	public tier!: Tier;

	@Field()
	public givingWorkshop?: boolean;

	@Field()
	public givingLightningTalk?: boolean;

	@Field()
	public workshopInfo?: string;

	@Field()
	public lightningTalkInfo?: string;
}
