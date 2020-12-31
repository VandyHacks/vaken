/* eslint-disable no-restricted-syntax  */
/* eslint import/no-extraneous-dependencies: 0 no-console: 0 */
import * as shell from 'shelljs';

interface Cluster {
	id: string;
	connectionString: string;
}
// we use curl in this file instead of something like fetch
// because curl has built in support for http digest auth (RFC 2069)
// and there exists no (good) library for node that supports it
// and mongo uses it

const API_URL = 'https://cloud.mongodb.com/api/atlas/v1.0';

const publicKey = 'tlaviyjt';
const privateKey = '2aa2ca50-93f4-42c2-a732-e93ac5db3114';

// just prepends the digest auth stuff
const makeCurlRequestString = (reqContents: string): string =>
	`curl -u "${publicKey}:${privateKey}" --digest ${reqContents}`;

const silentExec = (cmd: string, options: shell.ExecOptions = {}): shell.ShellString =>
	shell.exec(cmd, { ...options, silent: true }) as shell.ShellString;

export class MongoAtlasClient {
	projectId?: string;

	orgId?: string;

	clusterId?: string;

	constructor() {
		const getOrgsRtn = JSON.parse(silentExec(makeCurlRequestString(`"${API_URL}/orgs"`)));

		if (getOrgsRtn.results.length === 0 || getOrgsRtn.error) {
			throw new Error('Could not find organization this API key-pair has access to');
		} else {
			this.orgId = getOrgsRtn.results[0].id;
			if (getOrgsRtn.results.length > 1)
				console.log(
					`Found more than 1 organization this API key-pair has access to, selected "${getOrgsRtn.results[0].name}"`
				);
			else console.log(`Selected organization of name "${getOrgsRtn.results[0].name}"`);
		}
	}

	getOrCreateProject(): void {
		const projectName = 'vaken-managed';

		const getProjectRtn = JSON.parse(
			silentExec(makeCurlRequestString(`"${API_URL}/groups/byName/${projectName}"`))
		);

		if (getProjectRtn.error) {
			console.log(`Could not find existing project of name "${projectName}"`);

			this.createProject(projectName);
		} else {
			console.log(
				`Found existing project of name "${projectName}", skipping new project creation.`
			);
			this.projectId = getProjectRtn.id;
		}
	}

	private createProject(name: string): void {
		const createProjectRtn = JSON.parse(
			silentExec(
				makeCurlRequestString(
					`-H "Content-Type: application/json" -X POST "${API_URL}/groups" --data '{ "name" : "${name}", "orgId" : "${this.orgId}" }'`
				)
			)
		);

		if (createProjectRtn.error) {
			throw new Error("Couldn't create project, does this API key have permissions to do that?");
		} else {
			this.projectId = createProjectRtn.id;
			console.log(`Created project of name "${createProjectRtn.name}"`);
		}
	}

	getOrCreateCluster(): Cluster {
		if (this.projectId === undefined) throw new Error('Need a project ID');

		const getClusterRtn = JSON.parse(
			silentExec(
				makeCurlRequestString(
					`--header "Content-Type: application/json" --request GET "${API_URL}/groups/${this.projectId}/clusters/"`
				)
			)
		);

		if (getClusterRtn.error) {
			throw new Error("Couldn't get list of clusters in project.");
		}

		let rtn: Cluster | undefined;
		for (const cluster of getClusterRtn.results) {
			if (cluster.name.includes('Vaken')) {
				rtn = {
					id: cluster.id as string,
					connectionString: cluster.connectionStrings.standardSrv as string,
				};
				break;
			}
		}

		if (rtn === undefined) rtn = this.createCluster('M0');

		return rtn;
	}

	private createCluster(instanceSizeName: string): Cluster {
		if (this.projectId === undefined) throw new Error('Need a project ID');
		if (instanceSizeName === 'M0')
			throw new Error(
				"Mongo doesn't let us create M0 (free) clusters with the API. Set up a M0 cluster whose name starts with 'Vaken' in the MongoDB Atlas UI and rerun this script."
			);
		const options = {
			name: `Vaken ${process.env.USER}`,
			providerSettings: {
				providerName: 'GCP',
				instanceSizeName,
				regionName: 'US_CENTRAL_1',
			},
		};

		const requestString = makeCurlRequestString(
			`--header "Content-Type: application/json" --request POST "https://cloud.mongodb.com/api/atlas/v1.0/groups/${
				this.projectId
			}/clusters" --data '${JSON.stringify(options)}'`
		);

		const creationResponse = JSON.parse(silentExec(requestString));
		console.log(creationResponse);
		if (creationResponse.error) {
			throw new Error(
				`Couldn't create cluser of size ${options.providerSettings.instanceSizeName} name "${options.name}" in ${options.providerSettings.providerName}-${options.providerSettings.regionName}`
			);
		} else {
			console.log(
				`Created cluser of size ${options.providerSettings.instanceSizeName} name "${options.name}" in ${options.providerSettings.providerName}-${options.providerSettings.regionName}`
			);
			return {
				id: creationResponse.id,
				connectionString: creationResponse.connectionStrings.standardSrv,
			};
		}
	}
}

const client = new MongoAtlasClient();

client.getOrCreateProject();
client.getOrCreateCluster();
