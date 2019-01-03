/**
 * Setup script to set up new projects
 */
import { userModel } from '../src/users/User';
import dummy from 'mongoose-dummy';

let randomObject = dummy(userModel, {
  returnDate: true,
});
console.log(randomObject);

// TODO: generate 50 objs, put them in db
