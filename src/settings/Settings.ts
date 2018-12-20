// settings model
import { Typegoose, prop } from 'typegoose';

class Settings extends Typegoose {
  @prop({ required: true })
  status: string = '';

  @prop()
  timeOpen?: number;

  @prop()
  timeClose?: number;

  @prop()
  timeConfirm?: number;

  @prop()
  whitelistEmails?: string[];

  @prop()
  waitlistText?: string;

  @prop()
  acceptanceText?: string;

  @prop()
  confirmationText?: string;
}

const SETTINGS = new Settings().getModelForClass(Settings);

// export default User;
export default SETTINGS;
