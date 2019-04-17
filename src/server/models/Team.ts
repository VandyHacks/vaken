import { prop, arrayProp, Ref, Typegoose } from 'typegoose';
import { Hacker } from './Hacker';
import CONSTANTS from '../../common/constants.json';

class Team extends Typegoose {
	@prop()
	public teamName!: string;

	@arrayProp({ itemsRef: Hacker, required: true })
	public teamMembers: Ref<Hacker>[] = [];

	@prop({ max: CONSTANTS.MAX_TEAM_SIZE })
	public size: number = 0;
}

const TeamModel = new Team().getModelForClass(Team);

export { Team, TeamModel };

// Copyright (c) 2019 Vanderbilt University
