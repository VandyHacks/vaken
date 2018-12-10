import { Typegoose, prop } from 'typegoose';

const STR_DEFAULT = String();

class User extends Typegoose {
  @prop()
  name: string = STR_DEFAULT;

  @prop()
  email: string = STR_DEFAULT;

  @prop()
  school: string = STR_DEFAULT;

  @prop()
  graduationYear: string = STR_DEFAULT;

  @prop()
  gender: string = STR_DEFAULT;

  @prop()
  majors: [string] = [STR_DEFAULT];
}

export default User;
