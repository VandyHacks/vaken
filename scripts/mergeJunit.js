// this module doesn't have a .d.ts so this is a js file
const { mergeFiles } = require('junit-report-merger');

mergeFiles(
	'./reports/test/jest/results.xml',
	[
		'./reports/test/jest/client.xml',
		'./reports/test/jest/server.xml',
		'./reports/test/jest/common.xml',
	],
	() => {
		console.log('Finished merging JUnit reports.');
	}
);
