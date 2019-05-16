module.exports = {
	// roots: ['tests'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	// just specifying folder and filename in "output" option doesn't work for ?? reasons
	reporters: ['default', ['jest-junit', { outputDirectory: './reports/jest', outputName: 'results.xml' }]],
};

