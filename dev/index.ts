/* eslint import/no-extraneous-dependencies: 0 */
import concurrently from 'concurrently';
import * as shell from 'shelljs';


const dbSetup = () => {
	
}

const watchAndBuild = (): void => {
	shell.exec('npm run generate');
	concurrently([
		{
			name: 'client',
			prefixColor: 'bgBlue.bold',
			command: 'npm:dev:client',
		},
		{
			name: 'server',
			prefixColor: 'bgMagenta.bold',
			command: 'npm:dev:server:debug',
		},
		{
			name: 'codegen',
			prefixColor: 'bgYellow.bold',
			command: 'npm:generate:watch',
		},
	]);
};

watchAndBuild();
