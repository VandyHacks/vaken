/* eslint-disable */
module.exports = {
	collectCoverage: true,
	collectCoverageFrom: ['./src/**/*.{ts,tsx}'],
	moduleNameMapper: {
		'.+\\.svg?.+$': '@svgr/webpack', // see https://github.com/smooth-code/svgr/issues/83
		'react-virtualized/styles.css': 'jest-transform-css',
	},
	preset: 'ts-jest',
	reporters: [
		'default',
		['jest-junit', { outputDirectory: './reports/test/jest', outputName: 'results.xml' }],
	],
	testEnvironment: 'node',
	testPathIgnorePatterns: ['/node_modules/', '.eslintrc.js'],
	transform: {
		'^.+\\.jsx?$': 'babel-jest',
		'^.+\\.css$': 'jest-transform-css',
	},
};
