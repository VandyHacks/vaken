// settings model
import { Typegoose, prop, arrayProp } from 'typegoose';

class Settings extends Typegoose {
  @prop({ required: true })
  status: string = '';

  @prop()
  timeOpen?: number;

  @prop()
  timeClose?: number;

  @prop()
  timeConfirm?: number;

  @arrayProp({ items: String })
  whitelistEmails?: string[];

  @prop()
  waitlistText?: string;

  @prop()
  acceptanceText?: string;

  @prop()
  confirmationText?: string;

  // TODO: can and SHOULD use Mongoose virtual properties
  // typegoose supports this too
}

const SETTINGS = new Settings().getModelForClass(Settings);

// export default User;
export default SETTINGS;
