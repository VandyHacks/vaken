import { User } from './User';

class Organizer extends User {}

const organizerModel = new Organizer().getModelForClass(Organizer);

export { Organizer, organizerModel };

// Copyright (c) 2019 Vanderbilt University
