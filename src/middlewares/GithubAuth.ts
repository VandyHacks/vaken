// auth
import simpleOauth2, { ModuleOptions, OAuthClient } from 'simple-oauth2';
const { githubClientID, githubClientSecret } = process.env;
// Set the configuration settings
const creds: ModuleOptions = {
  client: {
    id: githubClientID || '',
    secret: githubClientSecret || '',
  },
  auth: {
    tokenHost: 'https://api.oauth.com',
  },
};

// Initialize the OAuth2 Library
const auth: OAuthClient = simpleOauth2.create(creds);
const authURI = auth.authorizationCode.authorizeURL({
  redirect_uri: 'http://localhost:3000/callback',
  scope: '<scope>', // can also be arr ['<scope1>, '<scope2>', '...']
  state: '<state>',
});

export default authURI;
