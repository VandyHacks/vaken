import { GoogleOauthRoutes } from './google';
import { GitHubOauthRoutes } from './github';
import { RequestHandler } from 'express';

export const authRoutes: Array<{ path: string; handler: RequestHandler }> = [
	...GoogleOauthRoutes,
	...GitHubOauthRoutes,
	{
		path: '/api/logout',
		handler: (req, res) => {
			req.logout();
			res.redirect('/');
		},
	},
];
