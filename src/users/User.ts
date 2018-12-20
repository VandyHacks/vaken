import { Typegoose, prop, Ref } from 'typegoose';
/* import bcrypt from 'bcrypt'; */

/**
 * Typegoose's equivalent to Mongoose pre-hook: On user save password, hash password
 */
/*
@pre<User>('save', _: Promise<any> : Function => {
  bcrypt.hash(this.password, 10, function (err: Error, hash: string){
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  })
})*/

enum UserRole {
  ADMIN = 'admin',
  APPLICANT = 'applicant',
  GUEST = 'guest',
  SPONSOR = 'sponsor',
  MENTOR = 'mentor',
  VOLUNTEER = 'volunteer',
}

class Demographic extends Typegoose {
  @prop()
  name?: string;
  @prop()
  school?: string;
  @prop()
  graduationYear?: string;
  @prop()
  gender?: string;
  @prop()
  majors?: string[];
  @prop()
  over21?: boolean;
}

class AppStatus extends Typegoose {
  @prop()
  submittedDate?: Date;
  @prop()
  confirmationDate?: Date;

  verified: boolean = false;
  @prop()
  submitted: boolean = false;
  @prop()
  accepted: boolean = false;
  @prop()
  confirmed: boolean = false;
  @prop()
  rejected: boolean = false;
  @prop()
  declined: boolean = false;
}

class Application extends Typegoose {
  @prop()
  essays?: string[];
}

class Confirmation extends Typegoose {
  @prop()
  essays?: string[];
}

class UserModel extends Typegoose {
  @prop()
  password?: string;

  @prop({ required: true })
  email: string = '';

  @prop({ enum: Object.values(UserRole), required: true })
  roles: Ref<UserRole>[] = [];

  @prop({ ref: Demographic })
  demographic?: Ref<Demographic>;

  @prop({ ref: AppStatus })
  appStatus?: Ref<AppStatus>;

  @prop({ ref: Application })
  application?: Ref<Application>;

  @prop({ ref: Confirmation })
  confirmation?: Ref<Confirmation>;
}
const USER = new UserModel().getModelForClass(UserModel);

// export default User;
export default USER;
