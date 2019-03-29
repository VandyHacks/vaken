import { prop, arrayProp, Ref, Typegoose } from 'typegoose';
import { Hacker } from './Hacker';

class Team extends Typegoose {
	@prop()
	public teamName!: string;

	@arrayProp({ itemsRef: Hacker, required: true })
	public teamMembers: Ref<Hacker>[] = [];

	@prop({ max: 4 })
	public size: number = 0;
}

const teamModel = new Team().getModelForClass(Team);

export { Team, teamModel };

// Copyright (c) 2019 Vanderbilt University
