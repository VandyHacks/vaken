import { prop, arrayProp, Typegoose } from 'typegoose';
import { User } from './User';

class Hacker extends User {
	@prop({ required: true })
	verified: boolean = false;

	@prop({ required: true })
	started: boolean = false;

	@prop({ required: true })
	submitted: boolean = false;

	@prop({ required: true })
	accepted: boolean = false;

	@prop({ required: true })
	confirmed: boolean = false;

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
	needReimbursement?: boolean;

	@prop()
	lightningTalk?: boolean;

	@prop()
	teamCode?: string;

	@prop()
	walkin?: boolean;
}

const hackerModel = new Hacker().getModelForClass(Hacker);

export { Hacker, hackerModel };
