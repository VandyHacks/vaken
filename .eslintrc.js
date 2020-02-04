// common eslint parser for ALL files that we use
// if you're looking for a client (especially React) or server lint rule
// go to the configs in their respective directories
module.exports = {
	extends: [
		'airbnb', // Airbnb style guide
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript', // Required for typescript
		'plugin:promise/recommended',
		'prettier',
		'prettier/@typescript-eslint', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
	],
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	plugins: ['@typescript-eslint', 'prettier', 'promise', 'jest'],
	settings: {
		'import/resolver': {
			typescript: {
				extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
			},
			webpack: {
				extensions: ['.svg', '.graphql'],
			},
		},
	},
	parserOptions: {
		tsConfigRootDir: __dirname,
		project: `${__dirname}/tsconfig.json`,
	},
	rules: {
		'no-void': 0,
		'no-underscore-dangle': 0,
		'no-return-assign': [2, 'except-parens'],
		'@typescript-eslint/explicit-function-return-type': [
			2,
			{ allowExpressions: true, allowTypedFunctionExpressions: true },
		],
		'prettier/prettier': 'error',
		'no-param-reassign': [2, { props: true, ignorePropertyModificationsFor: ['draft'] }],
		'import/no-extraneous-dependencies': [
			2,
			{ devDependencies: ['**/*.test.tsx', '**/*.test.ts'] },
		],
		'import/prefer-default-export': [0],
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				js: 'never',
				mjs: 'never',
				jsx: 'never',
				ts: 'never',
				tsx: 'never',
			},
		],
	},
	root: true,
	overrides: [
		{
			files: ['**/*.test.js'],
			env: { 'jest/globals': true },
		},
	],
};
