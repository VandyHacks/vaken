import { prop, arrayProp, Typegoose } from 'typegoose';
import { User } from './User';
import Ethnicity from '../enums/Ethnicity';
import Race from '../enums/Race';
import Status from '../enums/Status';

class Hacker extends User {
	@prop({ required: true })
	public status: Status = Status.Created;

	@prop()
	public school?: string;

	@prop()
	public gradYear?: string;

	@prop()
	public ethnicity?: Ethnicity;

	@arrayProp({ items: Race })
	public race?: Race[];

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
}

const hackerModel = new Hacker().getModelForClass(Hacker);

export { Hacker, hackerModel };

// Copyright (c) 2019 Vanderbilt University
