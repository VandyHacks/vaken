import { Application, default as express } from 'express';
import { sessionMiddleware } from './gateway/session';
import { GatewayService } from './gateway/apollo';
import { authRoutes } from './gateway/auth';
import { ApplicationsService } from './applications';
import { ResumesService } from './resumes';
import { UsersService } from './users';
import { GroupsService } from './groups';
import { MongoClient } from 'mongodb';
import { ApolloServer } from 'apollo-server-express';
import { DEFAULT_APOLLO_CONFIG } from './common/client';
import { MONGODB_URL, PORT } from './common/env';

/**
 * Set to 1 if server is running behind a trusted proxy. When behind a trusted proxy, the server
 * will set values in the request object based on the X-Forwarded-* headers, including things like
 * host and protocol, which are essential for auth cookies.
 */
let TRUST_PROXY = Number(process.env.TRUST_PROXY);
if (Number.isNaN(TRUST_PROXY)) {
	if (process.env.NODE_ENV === 'production') {
		console.warn(
			'TRUST_PROXY not specified. Defaulting to NOT trusting the proxy, which will ' +
				'break login sessions if this is running on Heroku or some other managed environment.'
		);
	}
	TRUST_PROXY = 0;
}
/** URL for services started locally */
const LOOPBACK_URL = `http://127.0.0.1:${PORT}`;

/** List of all (local or remote) services that compose the federated GraphQL service. */
const REQUIRED_SERVICES = [
	{ name: 'users', path: `/graphql/users`, server: UsersService },
	{ name: 'groups', path: `/graphql/groups`, server: GroupsService },
	{ name: 'resumes', path: `/graphql/resumes`, server: ResumesService },
	{ name: 'applications', path: `/graphql/applications`, server: ApplicationsService },
] as const;

/**
 * Returns initialized graphql service dependencies of the gateway. If an environment variable
 * matching the service's name followed by `_SERVICE_URL` is supplied, then that will be used
 * instead of starting the service locally. This may be used for microservice deployments or for
 * pointing the service at a dev/prod endpoint if running locally.
 *
 * Note: this method does not validate that remote services are functioning properly.
 *
 * @param app The express app to start services on, if local services must be started
 * @return the names and urls of downstream graph services
 */
async function initializeServices(app: Application): Promise<{ name: string; url: string }[]> {
	const mongo = await MongoClient.connect(MONGODB_URL);

	// Start the locally-running services and extract out the URL of remote services to simplify
	// handling in the gateway.
	const localServices: { name: string; path: string; server: ApolloServer }[] = [];
	const remoteServices: { name: string; url: string }[] = [];
	for (const service of REQUIRED_SERVICES) {
		const serviceUrl = process.env[`${service.name.toUpperCase()}_SERVICE_URL`];
		if (serviceUrl) {
			console.log(
				`Using ${
					service.name
				} service at \`${serviceUrl}\` because ${service.name.toUpperCase()}_SERVICE_URL is set`
			);
			remoteServices.push({ name: service.name, url: serviceUrl });
			continue;
		}
		localServices.push({
			name: service.name,
			path: service.path,
			server: new service.server(mongo, DEFAULT_APOLLO_CONFIG), // eslint-disable-line new-cap
		});
	}
	// Start locally-running services in parallel
	await Promise.all(
		localServices.map(service => {
			console.log(`Starting ${service.name} service locally`);
			return service.server.start();
		})
	);
	localServices.forEach(({ server, path }) => server.applyMiddleware({ app, path }));

	return [
		...remoteServices,
		...localServices.map(s => ({ ...s, url: `${LOOPBACK_URL}${s.path}` })),
	];
}

/** Starts an Express server with authentication routes and the federated vaken GraphQL server. */
export async function main(): Promise<void> {
	const app = express();
	// Allows secure login sessions to work behind a proxy / on Heroku.
	app.set('trust proxy', TRUST_PROXY);
	sessionMiddleware.forEach(handler => app.use(handler));
	authRoutes.forEach(route => {
		app.get(route.path, route.handler);
	});

	app.get('/', (req, res) => {
		res.send(`User: ${JSON.stringify(req.user, null, '\t')}`);
	});

	const services = await initializeServices(app);

	app.listen({ port: PORT });

	// The gateway must be started after all the locally-running services have been exposed so it can
	// query their schema and create the federated supergraph.
	const gateway = new GatewayService(services, DEFAULT_APOLLO_CONFIG);
	await gateway.start();
	gateway.applyMiddleware({ app, path: '/graphql' });

	console.log(`Gateway ready at http://localhost:${PORT}${gateway.graphqlPath}`);
}

main();
