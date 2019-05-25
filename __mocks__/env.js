// assign process.env
require('dotenv').config({ path: '../.env.template' }); // read env file (only works on local, not on CI)

// fallbacks
// process.env.GOOGLE_CLIENT_ID = 'value';
