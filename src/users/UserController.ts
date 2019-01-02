import { User, userModel } from './User';

// import { check, body, query, param, validationResult} from 'express-validator/check';

/**
 * NOTE: Error handling should be done by default error handling in server middleware
 * Do not handle separately in each controller unless you need specific handling behavior
 *
 *
 * For Mongoose functions on Models, see https://mongoosejs.com/docs/api.html#Model
 */

export default class UserController {
  // Display list of all Users.
  // TODO: support pagination/caching, or our API server might get crushed fast
  async user_list(id: string) {
    console.log(id);
    const users = await userModel.find({}).exec();
    if (!users) {
      throw new Error('Users not found.');
    }
    return users;
  }

  // Display detail page for a specific User.
  async user_detail(id: string) {
    // TODO: validate id
    console.log(id);
  }

  // Handle User create on POST.
  async user_create(newUser: Object) {
    const user: User = await userModel.create(newUser);
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }

  // Handle User delete on POST.
  async user_delete(id: string) {
    const user: User = await userModel.deleteOne({ id }).exec();
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }

  // Handle User update on POST.
  async user_update(id: string) {
    console.log(id);
    // const user: User = await userModel.updateOne({ id }).exec();
    // return user;
  }
}
