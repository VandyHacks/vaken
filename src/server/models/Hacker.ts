import { prop, arrayProp, Ref, Typegoose } from 'typegoose';
import { User } from './User';
import Ethnicity from '../enums/Ethnicity';
// import Race from '../enums/Race';
import Status from '../enums/Status';

class Hacker extends Typegoose {
	@prop({ ref: User, required: true })
	public user!: Ref<User>;

	@prop({ required: true })
	public status: Status = Status.Created;

	@prop()
	public school?: string;

	@prop()
	public gradYear?: string;

	@prop()
	public ethnicity?: Ethnicity;

	// Passing enum into arrayprop doesn't work
	// See https://github.com/szokodiakos/typegoose/issues/143
	// @arrayProp({ items: Race })
	// public race?: Race[];
	@arrayProp({ items: String })
	public race?: string[];

	@arrayProp({ items: String })
	public majors?: string[];

	@prop()
	public adult?: boolean;

	@prop()
	public firstHackathon?: boolean;

	@prop()
	public volunteer?: boolean;

	@prop()
	public github?: string;

	@prop()
	public linkedin?: string;

	@prop()
	public devpost?: string;

	@prop()
	public website?: string;

	@arrayProp({ items: String })
	public essays?: string[];

	@prop()
	public codeOfConduct?: boolean;

	@prop()
	public needsReimbursement?: boolean;

	@prop()
	public lightningTalk?: boolean;

	@prop()
	public teamCode?: string;

	@prop()
	public walkin?: boolean;

	@prop()
	public teamName?: string;
}

const HackerModel = new Hacker().getModelForClass(Hacker);

export { Hacker, HackerModel };

// Copyright (c) 2019 Vanderbilt University
