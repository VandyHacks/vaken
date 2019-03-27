import 'reflect-metadata';
import { Field, ObjectType, InputType } from 'type-graphql';

import { User } from './User';
import Ethnicity from '../enums/Ethnicity';
import Race from '../enums/Race';
import Status from '../enums/Status';

@ObjectType({ description: 'DTO for a Vaken hacker' })
@InputType()
class Hacker extends User {
	@Field()
	public status: Status = Status.Created;

	@Field()
	public school!: string;

	@Field()
	public gradYear!: string;

	@Field()
	public ethnicity!: Ethnicity;

	@Field(type => [Race])
	public race!: [Race];

	@Field(type => [String])
	public majors!: [string];

	@Field()
	public adult!: boolean;

	@Field()
	public firstHackathon!: boolean;

	@Field()
	public volunteer?: boolean;

	@Field()
	public github?: string;

	@Field()
	public linkedin?: string;

	@Field()
	public devpost?: string;

	@Field()
	public website?: string;

	@Field(type => [String])
	public essays?: [string];

	@Field()
	public codeOfConduct?: boolean;

	@Field()
	public needsReimbursement?: boolean;

	@Field()
	public lightningTalk?: boolean;

	@Field()
	public teamCode?: string;

	@Field()
	public walkin?: boolean;
}

export default Hacker;

// Copyright (c) 2019 Vanderbilt University
