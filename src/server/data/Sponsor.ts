import 'reflect-metadata';
import { Field, ObjectType, InputType } from 'type-graphql';

import { SponsorRep } from './SponsorRep';
import { Tier } from '../enums/Tier';

@ObjectType({ description: 'DTO for a Vaken sponsor' })
@InputType()
export class Sponsor {
	@Field()
	name: string = '';

	@Field(type => [SponsorRep])
	sponsorReps?: [SponsorRep];

	@Field(type => [SponsorRep])
	leadRep?: [SponsorRep];

	@Field()
	tier!: Tier;

	@Field()
	givingWorkshop?: boolean;

	@Field()
	givingLightningTalk?: boolean;

	@Field()
	workshopInfo?: string;

	@Field()
	lightningTalkInfo?: string;
}

// Copyright (c) 2019 Vanderbilt University
