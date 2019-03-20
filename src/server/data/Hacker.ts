import 'reflect-metadata';
import { Field, ObjectType, InputType } from 'type-graphql';

import { User } from './User';
import { Ethnicity } from '../enums/Ethnicity';
import { Race } from '../enums/Race';
import { Status } from '../enums/Status';

@ObjectType({ description: 'DTO for a Vaken hacker' })
@InputType()
export class Hacker extends User {
	@Field()
	status: Status = Status.Created;

	@Field()
	school!: string;

	@Field()
	gradYear!: string;

	@Field()
	ethnicity!: Ethnicity;

	@Field(type => [Race])
	race!: [Race];

	@Field(type => [String])
	majors!: [string];

	@Field()
	adult!: boolean;

	@Field()
	firstHackathon!: boolean;

	@Field()
	volunteer?: boolean;

	@Field()
	github?: string;

	@Field()
	linkedin?: string;

	@Field()
	devpost?: string;

	@Field()
	website?: string;

	@Field(type => [String])
	essays?: [string];

	@Field()
	codeOfConduct?: boolean;

	@Field()
	needsReimbursement?: boolean;

	@Field()
	lightningTalk?: boolean;

	@Field()
	teamCode?: string;

	@Field()
	walkin?: boolean;
}

// Copyright (c) 2019 Vanderbilt University