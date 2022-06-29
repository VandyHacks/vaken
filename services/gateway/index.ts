import express from 'express';
import { sessionMiddleware } from './session';
import { apolloServer } from './apollo';
import { authRoutes } from './auth';

let port = process.env.PORT;
if (!port) {
	console.warn('PORT not specified. Defaulting to port 4000');
	port = '4000';
}
let trustProxy = Number(process.env.TRUST_PROXY);
if (Number.isNaN(trustProxy)) {
	if (process.env.NODE_ENV === 'production') {
		console.warn(
			'TRUST_PROXY not specified. Defaulting to not trusting the proxy, which will ' +
				'break login sessions if this is running on Heroku.'
		);
	}
	trustProxy = 0;
}

const app = express();

async function main(): Promise<void> {
	await apolloServer.start();

	// Allows secure login sessions to work behind a proxy / on Heroku.
	app.set('trust proxy', trustProxy);
	sessionMiddleware.forEach(handler => app.use(handler));
	authRoutes.forEach(route => {
		app.get(route.path, route.handler);
	});

	app.get('/api/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

	app.get('/', (req, res) => {
		res.send(`User: ${JSON.stringify(req.user, null, '\t')}`);
	});

	apolloServer.applyMiddleware({ app });

	app.listen({ port }, () => {
		console.log(`Gateway ready at http://localhost:${port}${apolloServer.graphqlPath}`);
	});
}

main();
