/* eslint-disable */
module.exports = {
	collectCoverage: true,
	collectCoverageFrom: ['./src/**/*.{ts,tsx}'],
	moduleNameMapper: {
		'../../assets/img/square_hackathon_logo.svg': '<rootDir>/__mocks__/svgrMock.js',
		'../../assets/img/unchecked_box.svg': '<rootDir>/__mocks__/svgrMock.js',
		'../../assets/img/checked_box.svg': '<rootDir>/__mocks__/svgrMock.js',
		'.+\\.svg?.+$': '@svgr/webpack', // see https://github.com/smooth-code/svgr/issues/83
		'react-virtualized/styles.css': 'jest-transform-css',

		'\\.(jpg|jpeg|png|gif)$': '<rootDir>/__mocks__/svgrMock.js',
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
	setupFiles: ['./__mocks__/client.js'],
};
