import { USER } from './User';
import { Context } from 'koa';

// import { check, body, query, param, validationResult} from 'express-validator/check';

export default class UserController {
  // Display list of all Users.
  async user_list(id: string) {
    console.log(id);
  }

  // Display detail page for a specific User.
  async user_detail(id: string) {
    // TODO: validate id
    console.log(id);
  }

  // Handle User create on POST.
  async user_create(newUser: Object) {
    await USER.create(newUser, async (err: Error, docs: Document[]) => {
      if (err) {
        throw err;
      }
      return docs;
    });
  }

  // Handle User delete on POST.
  async user_delete(id: string) {
    USER.update({ id }, async (err: Error, docs: Document[]) => {
      if (err) {
        throw err;
      }
      return docs;
    });
  }

  // Handle User update on POST.
  async user_update(ctx: Context, _: Promise<any>) {
    console.log(ctx.body.id);
  }
}
