module.exports = {
	collectCoverage: true,
	collectCoverageFrom: [
		'./src/**/*.{ts,tsx}',
		'!./src/**/*.stories.tsx',
		'!./src/**/*graphql.ts',
		'!./src/**/*.d.ts',
		'!**/*.test.ts*',
	],
	coverageReporters: ['text', 'lcov'],
	testPathIgnorePatterns: ['/node_modules/', '.eslintrc.js'],
	projects: [
		{
			// client-side testing config
			displayName: 'Test client',
			testMatch: [
				'<rootDir>/src/client/**/*.test.ts*',
				'<rootDir>/plugins/**/*.test.tsx',
				'<rootDir>/plugins/**/*.client.tsx',
			],
			setupFiles: ['./__mocks__/fetch.js'],
			testEnvironment: 'jsdom',
			snapshotResolver: './__mocks__/snapshotResolver',
			moduleNameMapper: {
				'\\.svg': '<rootDir>/__mocks__/svgrMock.js', // see https://github.com/smooth-code/svgr/issues/83
				'\\.(css|less)$': 'jest-transform-css',
				'\\.(jpg|jpeg|png|gif)$': '<rootDir>/__mocks__/svgrMock.js',
			},
			transform: {
				'^.+\\.(t|j)sx?$': '@swc/jest',
				'^.+\\.css$': 'jest-transform-css',
			},
			setupFilesAfterEnv: ['./src/client/setupTests.js'],
		},
		{
			// server-side testing config
			displayName: 'Test server',
			testMatch: [
				'<rootDir>/src/server/**/*.test.ts',
				'<rootDir>/plugins/**/*.test.ts',
				'<rootDir>/plugins/**/*.server.test.ts',
			],
			setupFiles: ['./__mocks__/env.js'],
			testEnvironment: 'node',
			snapshotResolver: './__mocks__/snapshotResolver',

			// we can only have one preset at a time
			// this uses the typescript preset's transformer
			// and mongo's preset to allow both to coeexist
			transform: {
				'^.+\\.(t|j)sx?$': '@swc/jest',
			},
			preset: '@shelf/jest-mongodb',
		},
		{
			// testing config for ./common
			displayName: 'Test other',
			testMatch: ['<rootDir>/src/common/**/*.test.ts'],
			setupFiles: ['./__mocks__/env.js'], // eslint-disable-line import/no-extraneous-dependencies
			transform: {
				'^.+\\.(t|j)sx?$': '@swc/jest',
			},
			testPathIgnorePatterns: ['.eslintrc.js'],
		},
		{
			displayName: 'Add Happo/Storybook tests to code coverage numbers',
			testMatch: ['<rootDir>/.storyshots/index.js'],
			moduleNameMapper: {
				'\\.svg': '<rootDir>/__mocks__/svgrMock.js', // see https://github.com/smooth-code/svgr/issues/83
				'\\.(css|less)$': 'jest-transform-css',
				'\\.(jpg|jpeg|png|gif)$': '<rootDir>/__mocks__/svgrMock.js',
			},
			transform: {
				'^.+\\.(t|j)sx?$': '@swc/jest',
			},
		},
	],
};
