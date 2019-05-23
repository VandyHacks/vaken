// for the client ONLY
module.exports = {
	extends: [
		'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
		'plugin:react/recommended',
		'airbnb', // Airbnb style guide
		'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
		'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
	],
	settings: {
		'import/resolver': {
			webpack: {
				config: 'webpack.dev.js',
			},
		},
	},
	plugins: ['react', 'react-hooks'],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports
		project: './tsconfig.json',
	},
	rules: {
		'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
		'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
		'prettier/prettier': 'error',
		'react/jsx-indent': [2, 'tab', { checkAttributes: true }],
		'no-param-reassign': [2, { props: true, ignorePropertyModificationsFor: ['draft'] }],
		'react/jsx-indent-props': [2, 'tab'],
		'react/jsx-closing-bracket-location': [0, 'tag-aligned'], // Handled by prettier
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
		'typescript/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'no-console': 'off',
	},
	env: {
		browser: true,
	},
};
