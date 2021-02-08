import { readFile } from 'fs';
import { promisify } from 'util';
import { eq as semverEqual } from 'semver';

const readFileAsync = promisify(readFile);

// Heroku needs engines.node and doesn't respect .nvmrc
// but nvm is a useful developer tool
// so we keep them in sync like this
// we'd potentially have to do the same thing with a base docker image
// if we ever used docker
describe('Node version', () => {
	it.only(".nvmrc matches package.json's engines.node", async () => {
		const nvmrc = await readFileAsync('./.nvmrc', { encoding: 'utf8' });
		const packageJsonEngineNode = JSON.parse(
			await readFileAsync('./package.json', { encoding: 'utf8' })
		).engines.node;

		expect(semverEqual(nvmrc, packageJsonEngineNode)).toBeTruthy();
	});
});
