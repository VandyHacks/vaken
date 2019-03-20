import 'reflect-metadata';
import { Field, ObjectType, InputType } from 'type-graphql';

import { User } from './User';
import { Ethnicity } from '../enums/Ethnicity';
import { Race } from '../enums/Race';
import { Status } from '../enums/Status';

@ObjectType({ description: 'DTO for a Vaken hacker' })
@InputType()
export class Hacker extends User {
	@Field(type => Status)
	status: Status = Status.Created; // Indicates a user was created but that's it

	@Field(type => String)
	school!: String;

	@Field(type => String)
	gradYear!: String;

	@Field(type => Ethnicity)
	ethnicity!: Ethnicity;

	@Field(type => [Race])
	race!: [Race];

	@Field(type => [String])
	majors!: [String];

	@Field(type => Boolean)
	adult!: Boolean;

	@Field(type => Boolean)
	firstHackathon!: Boolean;

	@Field(type => Boolean)
	volunteer?: Boolean;

	@Field(type => String)
	github?: String;

	@Field(type => String)
	linkedin?: String;

	@Field(type => String)
	devpost?: String;

	@Field(type => String)
	website?: String;

	@Field(type => [String])
	essays?: [String];

	@Field(type => Boolean)
	codeOfConduct?: Boolean;

	@Field(type => Boolean)
	needsReimbursement?: Boolean;

	@Field(type => Boolean)
	lightningTalk?: Boolean;

	@Field(type => String)
	teamCode?: String;

	@Field(type => Boolean)
	walkin?: Boolean;
}

// Copyright (c) 2019 Vanderbilt University