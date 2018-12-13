import User from '../models/User';
import { Request, Response } from 'express';
import { check, ValidationChain } from 'express-validator/check';
// import { check, body, query, param, validationResult} from 'express-validator/check';

export default class UserController {
  private sanitizeUserInput(input: string): ValidationChain {
    // TODO: fix
    return check(input)
      .isString()
      .isAfter();
  }

  // Display list of all Users.
  async user_list(req: Request, res: Response) {
    this.sanitizeUserInput(req.params.id); // TODO: entirely wrong lol

    await res.send('NOT IMPLEMENTED: User list');
  }

  // Display detail page for a specific User.
  async user_detail(req: Request, res: Response) {
    const { id } = req.params.id;

    // TODO: validate id
    console.log(id);

    res.send('NOT IMPLEMENTED: User detail: ');
  }

  // Handle User create on POST.
  async user_create(req: Request, _: Response) {
    console.log(req.body.newuser);
    const { newuser } = req.body;

    // TODO: sanitize input also

    // TODO: validate newuser
    check(newuser.name)
      .isString()
      .isAlpha()
      .isLength({ min: 1, max: 60 });
    check(newuser.password)
      .isString()
      .isAlphanumeric()
      .isLength({ min: 1, max: 60 });

    await User.create(newuser, async (err: Error, docs: Document[]) => {
      if (err) {
        throw err;
      }
      return docs;
    });
  }

  // Handle User delete on POST.
  async user_delete(req: Request, res: Response) {
    console.log(req.body.id);
    const { id } = req.body;

    // validate req.body.id

    // validate req.body.profile

    User.update({ id }, async (err: Error, docs: Document[]) => {
      if (err) {
        throw err;
      }
      return docs;
    });

    res.send('NOT IMPLEMENTED: User delete POST');
  }

  // Handle User update on POST.
  async user_update(req: Request, res: Response) {
    console.log(req.body.id);
    res.send('NOT IMPLEMENTED: User update POST');
  }
}
