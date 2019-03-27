import { arrayProp } from 'typegoose';
import { User } from './User';

class Mentor extends User {
	@arrayProp({ items: String, required: true })
	public shifts?: string[];

	@arrayProp({ items: String, required: true })
	public skills?: string[];
}

const mentorModel = new Mentor().getModelForClass(Mentor);

export { Mentor, mentorModel };

// Copyright (c) 2019 Vanderbilt University
