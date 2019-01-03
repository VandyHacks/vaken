import { Typegoose, prop, arrayProp } from 'typegoose';
// import bcrypt from 'bcrypt';

/**
 * Typegoose's equivalent to Mongoose pre-hook: On user save password, hash password
 */
/*
@pre<User>('save', function(next) {
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

enum Gender {
  MALE = 'M',
  FEMALE = 'F',
  OTHER = 'O',
}

class Demographic extends Typegoose {
  @prop()
  name?: string;

  @prop()
  school?: string;

  @prop()
  graduationYear?: number;

  @prop({ enum: Gender })
  gender?: Gender;

  @arrayProp({ items: String })
  majors?: string[];

  @prop()
  over21?: boolean;
}

class AppStatus extends Typegoose {
  @prop()
  submittedDate?: Date;

  @prop()
  confirmationDate?: Date;

  @prop()
  verified: boolean = false;

  @prop()
  submitted: boolean = false;

  @prop()
  admitted: boolean = false;

  @prop()
  confirmed: boolean = false;

  @prop()
  rejected: boolean = false;

  @prop()
  declined: boolean = false;
}

class Application extends Typegoose {
  @arrayProp({ items: String })
  essays?: string[];
}

class Confirmation extends Typegoose {
  @arrayProp({ items: String })
  essays?: string[];
}

class User extends Typegoose {
  @prop()
  password?: string;

  @prop({ required: true })
  email: string = '';

  @arrayProp({ items: String, enum: UserRole, required: true })
  roles: UserRole[] = [];

  @prop()
  demographic?: Demographic;

  @prop()
  appStatus?: AppStatus;

  @prop()
  application?: Application;

  @prop()
  confirmation?: Confirmation;
}

const userModel = new User().getModelForClass(User);
const demographicModel = new Demographic().getModelForClass(Demographic);
const appStatusModel = new AppStatus().getModelForClass(AppStatus);
const applicationModel = new Application().getModelForClass(Application);
const confirmationModel = new Confirmation().getModelForClass(Confirmation);

// export default User;
export {
  userModel,
  User,
  demographicModel,
  appStatusModel,
  applicationModel,
  confirmationModel,
};
