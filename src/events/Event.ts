// events
import { Typegoose, prop, arrayProp } from 'typegoose';

enum EventType {
  BUS = 'Bus',
  CHECKIN = 'CheckIn',
  CEREMONY = 'Ceremony',
  MEAL = 'Meal',
  TECH_TALK = 'Tech Talk',
  FUN = 'Fun',
  MISC = 'Misc.',
}

class Event extends Typegoose {
  @prop({ required: true })
  name: string = '';

  @prop({ required: true })
  isOpen: boolean = true;

  @prop({ enum: EventType, required: true })
  type: EventType = EventType.MISC;

  @arrayProp({ items: Object })
  attendees?: { attendee: string; timeStamp: Date }[];
}

const EVENT = new Event().getModelForClass(Event);

// export default User;
export default EVENT;
