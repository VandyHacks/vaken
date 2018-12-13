import { Typegoose, prop } from 'typegoose';
/* import bcrypt from 'bcrypt'; */

const STR_DEFAULT = String();

/**
 * Typegoose's equivalent to Mongoose pre-hook: On user save password, hash password
 */
/*
@pre<User>('save', next : Function => {
  bcrypt.hash(this.password, 10, function (err: Error, hash: string){
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  })
})*/

class User extends Typegoose {
  @prop()
  name: string = STR_DEFAULT;

  @prop()
  password: string = STR_DEFAULT;

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

// const UserModel = new User().getModelForClass(User);
export default User;
