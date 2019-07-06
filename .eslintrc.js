// common eslint parser for ALL files that we use
// if you're looking for a client (especially React) or server lint rule
// go to the configs in their respective directories
module.exports = {
	env: { 'jest/globals': true },
	extends: [
		'airbnb', // Airbnb style guide
		'eslint:recommended',
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
	plugins: [
		'@typescript-eslint',
		'prettier',
		'sort-keys-fix',
		'promise',
		'typescript-sort-keys',
		'jest',
	],
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
		tsConfigRootDir: './',
		project: './tsconfig.json',
	},
	rules: {
		'typescript-sort-keys/interface': 2,
		'typescript-sort-keys/string-enum': 2,
		'@typescript-eslint/explicit-function-return-type': [
			2,
			{ allowExpressions: true, allowTypedFunctionExpressions: true },
		],
		'sort-keys-fix/sort-keys-fix': ['error', 'asc', { caseSensitive: true, natural: true }],
		'prettier/prettier': 'error',
		'no-param-reassign': [2, { props: true, ignorePropertyModificationsFor: ['draft'] }],
		'import/no-extraneous-dependencies': [
			2,
			{ devDependencies: ['**/*.test.tsx', '**/*.test.ts'] },
		],
	},
	root: true,
};
