/* eslint-disable */
module.exports = {
	collectCoverage: true,
	collectCoverageFrom: ['./src/**/*.{ts,tsx}'],
	preset: 'ts-jest',
	reporters: ['default', ['jest-junit', { outputDirectory: './reports/test/jest', outputName: 'results.xml' }]],
	testEnvironment: 'node',

};
