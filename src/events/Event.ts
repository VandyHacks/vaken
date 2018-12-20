// events
import { Typegoose, prop, Ref } from 'typegoose';

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

  @prop({ enum: Object.values(EventType), required: true })
  type: Ref<EventType> = EventType.MISC;

  @prop()
  attendees?: { attendee: string; timeStamp: Date }[];
}

const EVENT = new Event().getModelForClass(Event);

// export default User;
export default EVENT;
