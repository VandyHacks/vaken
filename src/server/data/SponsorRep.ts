import 'reflect-metadata';
import { Field, ObjectType } from 'type-graphql';

import { User } from './User';
import { Sponsor } from './Sponsor';

@ObjectType({ description: 'DTO for a Vaken sponsor rep' })
export class SponsorRep extends User {
	@Field(type => [Sponsor])
	sponsors!: [Sponsor];

	@Field()
	title!: string;

	@Field()
	leadRep!: boolean;
}

// Copyright (c) 2019 Vanderbilt University
