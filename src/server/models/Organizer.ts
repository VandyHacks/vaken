import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';
import { User } from './User';

class Organizer extends User {}

const organizerModel = new Organizer().getModelForClass(Organizer);

export { Organizer, organizerModel };
