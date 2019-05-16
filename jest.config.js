module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	collectCoverage: true,
	collectCoverageFrom: ['./src/**/*.{ts,tsx}'],
	reporters: ['default', ['jest-junit', { outputDirectory: './reports/jest', outputName: 'results.xml' }]],
};

