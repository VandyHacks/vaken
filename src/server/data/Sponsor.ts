import 'reflect-metadata';
import { Field, ObjectType } from 'type-graphql';

import { SponsorRep } from './SponsorRep';
import { Tier } from '../enums/Tier';

@ObjectType({ description: 'DTO for a Vaken sponsor' })
export class Sponsor {
	@Field(type => String)
	name: String = '';

	@Field(type => [SponsorRep])
	sponsorReps?: [SponsorRep];

	@Field(type => [SponsorRep])
	leadRep?: [SponsorRep];

	@Field(type => Tier)
	tier!: Tier;

	@Field(type => Boolean)
	givingWorkshop?: Boolean;

	@Field(type => Boolean)
	givingLightningTalk?: Boolean;

	@Field(type => String)
	workshopInfo?: String;

	@Field(type => String)
	lightningTalkInfo?: String;
}

// Copyright (c) 2019 Vanderbilt University
