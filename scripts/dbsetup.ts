/**
 * Setup script to set up new projects
 */
import * as models from '../src/users/User';
import dummy from 'mongoose-dummy';

let randomObject = dummy(models.userModel, {
  returnDate: true,
  force: {
    demographic: dummy(models.demographicModel),
    appStatus: dummy(models.appStatusModel),
    application: dummy(models.applicationModel),
    confirmation: dummy(models.confirmationModel),
  },
});
console.log(randomObject);

// TODO: generate 50 objs, put them in db
