import { prop, arrayProp, Ref, Typegoose } from 'typegoose';
import { Hacker } from './Hacker';

class Team extends Typegoose {
	public MAX_SIZE = 4;

	@prop()
	public teamName!: string;

	@arrayProp({ itemsRef: Hacker, required: true })
	public teamMembers: Ref<Hacker>[] = [];
}

const teamModel = new Team().getModelForClass(Team);

export { Team, teamModel };

// Copyright (c) 2019 Vanderbilt University
