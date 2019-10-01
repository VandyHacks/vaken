/* eslint-disable */
module.exports = {
	collectCoverage: true,
	collectCoverageFrom: [
		'./src/**/*.{ts,tsx}',
		'!./src/**/*graphql.ts',
		'!./src/**/*.d.ts',
		'!**/*.test.ts*',
	],
	reporters: [
		'default',
		['jest-junit', { outputDirectory: './reports/test/jest', outputName: 'results.xml' }],
	],
	testPathIgnorePatterns: ['/node_modules/', '.eslintrc.js'],
	projects: [
		{
			// client-side testing config
			displayName: 'Test client',
			testMatch: ['<rootDir>/src/client/**/*.test.ts*'],
			setupFiles: ['./__mocks__/fetch.js'],
			testEnvironment: 'jsdom',
			snapshotResolver: './__mocks__/snapshotResolver',
			moduleNameMapper: {
				'../../assets/img/square_hackathon_logo.svg': '<rootDir>/__mocks__/svgrMock.js',
				'../../assets/img/unchecked_box.svg': '<rootDir>/__mocks__/svgrMock.js',
				'../../assets/img/checked_box.svg': '<rootDir>/__mocks__/svgrMock.js',
				'.+\\.svg?.+$': '@svgr/webpack', // see https://github.com/smooth-code/svgr/issues/83
				'\\.(css|less)$': 'jest-transform-css',

				'\\.(jpg|jpeg|png|gif)$': '<rootDir>/__mocks__/svgrMock.js',
			},
			transform: {
				'^.+\\.jsx?$': 'babel-jest',
				'^.+\\.css$': 'jest-transform-css',
			},
			preset: 'ts-jest',
			testPathIgnorePatterns: ['__snapshots__', '.eslintrc.js'],
		},
		{
			// server-side testing config
			displayName: 'Test server',
			testMatch: ['<rootDir>/src/server/**/*.test.ts'],
			setupFiles: ['./__mocks__/env.js'],
			testEnvironment: 'node',
			snapshotResolver: './__mocks__/snapshotResolver',
			transform: {
				'^.+\\.jsx?$': 'babel-jest',
			},
			preset: 'ts-jest',
		},
		{
			// testing config for ./common
			displayName: 'Test other',
			testMatch: ['<rootDir>/src/common/**/*.test.ts'],
			setupFiles: ['./__mocks__/env.js'],
			transform: {
				'^.+\\.jsx?$': 'babel-jest',
			},
			preset: 'ts-jest',
			testPathIgnorePatterns: ['.eslintrc.js'],
		},
	],
};
