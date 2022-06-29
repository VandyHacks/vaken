import { GoogleOauthRoutes } from './google';
import { GitHubOauthRoutes } from './github';

export const authRoutes = [...GoogleOauthRoutes, ...GitHubOauthRoutes];
