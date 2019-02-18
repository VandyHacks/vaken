import { prop, arrayProp, Typegoose } from 'typegoose';
import { User } from './User';

class Mentor extends User {
	@arrayProp({ items: String, required: true })
	shifts?: string[];

	@arrayProp({ items: String, required: true })
	skills?: string[];
}

const mentorModel = new Mentor().getModelForClass(Mentor);

export { Mentor, mentorModel };

// Copyright (c) 2019 Vanderbilt University
