import { prop, Ref, Typegoose } from 'typegoose';
import { User } from './User';

class Organizer extends Typegoose {
	@prop({ ref: User, required: true })
	public user!: Ref<User>;
}

const OrganizerModel = new Organizer().getModelForClass(Organizer);

export { Organizer, OrganizerModel };

// Copyright (c) 2019 Vanderbilt University
