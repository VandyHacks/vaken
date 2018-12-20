import {
  AccessToken,
  OAuthClient,
  AuthorizationTokenConfig,
  ClientCredentialTokenConfig,
} from 'simple-oauth2';

// Revoke both access and refresh tokens
const revokeToken = async (accessToken: AccessToken) => {
  try {
    // Revokes both tokens, refresh token is only revoked if the access_token is properly revoked
    await accessToken.revokeAll();
  } catch (error) {
    console.log('Error revoking token: ', error.message);
  }
};

// Check if the token is expired. If expired it is refreshed.
const refreshTokenIfExpired = async (accessToken: AccessToken) => {
  if (accessToken.expired()) {
    try {
      const refreshedToken = await accessToken.refresh();
      return refreshedToken;
    } catch (error) {
      console.log('Error refreshing access token: ', error.message);
      return null;
    }
  }
  return null;
};

// Save the access token [Auth code flow]
const saveAccessToken = async (
  authClient: OAuthClient,
  tokenConfig: AuthorizationTokenConfig
) => {
  try {
    const result = await authClient.authorizationCode.getToken(tokenConfig);
    const accessToken = authClient.accessToken.create(result);
    return accessToken;
  } catch (error) {
    console.error('Access Token Error: ', error.message);
    return null;
  }
};

// Get the access token object for the client [Client creds flow]
const getAccessToken = async (
  authClient: OAuthClient,
  tokenConfig: ClientCredentialTokenConfig
) => {
  try {
    const result = await authClient.clientCredentials.getToken(tokenConfig);
    const accessToken = authClient.accessToken.create(result);
    return accessToken;
  } catch (error) {
    console.error('Access Token error', error.message);
    return null;
  }
};

export default {
  getAccessToken,
  revokeToken,
  refreshTokenIfExpired,
  saveAccessToken,
};
