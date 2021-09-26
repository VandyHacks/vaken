// common eslint parser for ALL files that we use
// if you're looking for a client (especially React) or server lint rule
// go to the configs in their respective directories
module.exports = {
	extends: [
		'airbnb', // Airbnb style guide
		'plugin:react/recommended',
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
	plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier', 'promise', 'jest'],
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
	reportUnusedDisableDirectives: true,
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
		'no-use-before-define': [0],
		'@typescript-eslint/no-use-before-define': ['error'],
		'@typescript-eslint/explicit-module-boundary-types': [0],
		'promise/catch-or-return': [
			2,
			{ allowFinally: true }
		]
	},
	root: true,
	overrides: [
		{
			files: ['**/plugins/**/*'],
			rules: {
				camelcase: [0],
			},
		},
		{
			files: ['**/scripts/**/*'],
			rules: {
				"no-console": 0
			}
		},
		{
			files: ['**/*.test.js'],
			env: { 'jest/globals': true },
		},
		{
			files: ['src/client/**/*', 'plugins/**/*'],
			env: { browser: true },
			rules: {
				'react/prop-types': [0], // Not necessary as we use TypeScript for this
				'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
				'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
				'react/jsx-indent': [0], // Conflicts with prettier
				'react/jsx-indent-props': [2, 'tab'],
				'react/jsx-closing-bracket-location': [0, 'tag-aligned'], // Handled by prettier
				'react/jsx-props-no-spreading': [0],
				'react/jsx-curly-newline': [0], // Handled by prettier
				'react/jsx-filename-extension': [
					2,
					{
						extensions: ['.tsx', '.jsx'],
					},
				],
				'jsx-a11y/label-has-associated-control': [
					1,
					{
						labelComponents: ['CustomInputLabel'],
						labelAttributes: ['label'],
						controlComponents: ['CustomInput'],
						assert: 'either',
					},
				],
				'jsx-a11y/label-has-for': [0],
				'no-console': [0],
				'react/require-default-props': [0],
			},
		},
		{
			files: ['__mocks__/*.js'],
			parserOptions: { ecmaVersion: 6 },
		},
	],
};
