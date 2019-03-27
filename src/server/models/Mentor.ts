import { arrayProp } from 'typegoose';
import { User } from './User';

class Mentor extends User {
	@arrayProp({ items: String, required: true })
	private shifts?: string[];

	@arrayProp({ items: String, required: true })
	private skills?: string[];
}

const mentorModel = new Mentor().getModelForClass(Mentor);

export { Mentor, mentorModel };

// Copyright (c) 2019 Vanderbilt University
