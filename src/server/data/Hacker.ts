import 'reflect-metadata';
import { Field, ObjectType, InputType } from 'type-graphql';

import User from './User';
import Ethnicity from '../enums/Ethnicity';
import Race from '../enums/Race';
import Status from '../enums/Status';

@ObjectType({ description: 'DTO for a Vaken hacker' })
@InputType()
export default class Hacker extends User {
	@Field()
	public status: Status = Status.Created;

	@Field({ nullable: true })
	public school?: string;

	@Field({ nullable: true })
	public gradYear?: string;

	@Field({ nullable: true })
	public ethnicity?: Ethnicity;

	@Field(() => [Race], { nullable: true })
	public race?: Race[];

	@Field(() => [String], { nullable: true })
	public majors?: string[];

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

	@Field(() => [String], { nullable: true })
	public essays?: string[];

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

	@Field({ nullable: true })
	public teamName?: string;
}
