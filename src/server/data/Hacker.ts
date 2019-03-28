import 'reflect-metadata';
import { Field, ObjectType, InputType } from 'type-graphql';

import { User } from './User';
import Ethnicity from '../enums/Ethnicity';
import Race from '../enums/Race';
import Status from '../enums/Status';

@ObjectType({ description: 'DTO for a Vaken hacker' })
@InputType()
export class Hacker extends User {
	@Field()
	public status: Status = Status.Created;

	@Field({ nullable: true })
	public school?: string;

	@Field({ nullable: true })
	public gradYear?: string;

	@Field({ nullable: true })
	public ethnicity?: Ethnicity;

	@Field(type => [Race], { nullable: true })
	public race?: [Race];

	@Field(type => [String], { nullable: true })
	public majors?: [string];

	@Field({ nullable: true })
	public adult?: boolean;

	@Field({ nullable: true })
	public firstHackathon?: boolean;

	@Field({ nullable: true })
	public volunteer?: boolean;

	@Field({ nullable: true })
	public github?: string;

	@Field({ nullable: true })
	public linkedin?: string;

	@Field({ nullable: true })
	public devpost?: string;

	@Field({ nullable: true })
	public website?: string;

	@Field(type => [String], { nullable: true })
	public essays?: [string];

	@Field({ nullable: true })
	public codeOfConduct?: boolean;

	@Field({ nullable: true })
	public needsReimbursement?: boolean;

	@Field({ nullable: true })
	public lightningTalk?: boolean;

	@Field({ nullable: true })
	public teamCode?: string;

	@Field({ nullable: true })
	public walkin?: boolean;
}

export default Hacker;

// Copyright (c) 2019 Vanderbilt University
