import { prop, arrayProp, Typegoose } from 'typegoose';
import { User } from './User';
import { Status } from '../enums/Status';

class Hacker extends User {
	@prop({ required: true })
	status!: Status;

	@prop()
	school?: string;

	@prop()
	gradYear?: string;

	@arrayProp({ items: String })
	ethnicity?: string[];

	@arrayProp({ items: String })
	majors?: string[];

	@prop()
	adult?: boolean;

	@prop()
	firstHackathon?: boolean;

	@prop()
	volunteer?: boolean;

	@prop()
	github?: string;

	@prop()
	linkedin?: string;

	@prop()
	devpost?: string;

	@prop()
	website?: string;

	@arrayProp({ items: String })
	essays?: string[];

	@prop()
	codeOfConduct?: boolean;

	@prop()
	needsReimbursement?: boolean;

	@prop()
	lightningTalk?: boolean;

	@prop()
	teamCode?: string;

	@prop()
	walkin?: boolean;
}

const hackerModel = new Hacker().getModelForClass(Hacker);

export { Hacker, hackerModel };

// Copyright (c) 2019 Vanderbilt University
