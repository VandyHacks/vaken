// for the client ONLY
module.exports = {
	// NOTE: this stacks on top of common eslint rules
	extends: [
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
		'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
	],
	plugins: ['react', 'react-hooks'],
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
	},
	env: {
		browser: true,
	},
	parserOptions: {
		tsConfigRootDir: `${__dirname}/../..`,
		project: `${__dirname}/../../tsconfig.json`,
	},
};
