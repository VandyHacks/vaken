// assign process.env
// TODO(timliang): revert before merging
require('dotenv').config({ path: './.env' }); // read env file (only works on local, not on CI)

// fallbacks
// process.env.GOOGLE_CLIENT_ID = 'value';
