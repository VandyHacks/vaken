import { prop, arrayProp, Typegoose } from 'typegoose';
import { User } from './User';
import { Status } from '../enums/Status';

class Hacker extends User {
	@prop({ required: true })
	private status!: Status;

	@prop()
	private school?: string;

	@prop()
	private gradYear?: string;

	@arrayProp({ items: String })
	private ethnicity?: string[];

	@arrayProp({ items: String })
	private majors?: string[];

	@prop()
	private adult?: boolean;

	@prop()
	private firstHackathon?: boolean;

	@prop()
	private volunteer?: boolean;

	@prop()
	private linkedin?: string;

	@prop()
	private devpost?: string;

	@prop()
	private website?: string;

	@arrayProp({ items: String })
	private essays?: string[];

	@prop()
	private codeOfConduct?: boolean;

	@prop()
	private needsReimbursement?: boolean;

	@prop()
	private lightningTalk?: boolean;

	@prop()
	private teamCode?: string;

	@prop()
	private walkin?: boolean;
}

const hackerModel = new Hacker().getModelForClass(Hacker);

export { Hacker, hackerModel };

// Copyright (c) 2019 Vanderbilt University
