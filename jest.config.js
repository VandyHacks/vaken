/* eslint-disable */
module.exports = {
	collectCoverage: true,
	collectCoverageFrom: ['./src/**/*.{ts,tsx}'],
	reporters: [
		'default',
		['jest-junit', { outputDirectory: './reports/test/jest', outputName: 'results.xml' }],
	],
	testPathIgnorePatterns: ['/node_modules/', '.eslintrc.js'],
	projects: [
		{
			// client-side testing config
			displayName: 'Test client',
			testMatch: ['<rootDir>/__tests__/client/**'],
			// setupFiles: ['./__mocks__/client.js'],
			testEnvironment: 'jsdom',
			moduleNameMapper: {
				'../../assets/img/square_hackathon_logo.svg': '<rootDir>/__mocks__/svgrMock.js',
				'../../assets/img/unchecked_box.svg': '<rootDir>/__mocks__/svgrMock.js',
				'../../assets/img/checked_box.svg': '<rootDir>/__mocks__/svgrMock.js',
				'.+\\.svg?.+$': '@svgr/webpack', // see https://github.com/smooth-code/svgr/issues/83
				'react-virtualized/styles.css': 'jest-transform-css',

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
			testMatch: ['<rootDir>/__tests__/server/**/*.ts'],
			setupFiles: ['./__mocks__/env.js'],
			testEnvironment: 'node',
			transform: {
				'^.+\\.jsx?$': 'babel-jest',
			},
			preset: 'ts-jest',
		},
		{
			// misc testing config
			displayName: 'Test other',
			testMatch: ['<rootDir>/__tests__/*.ts'],
			setupFiles: ['./__mocks__/env.js'],
			testPathIgnorePatterns: ['.eslintrc.js'],
		},
	],
};
