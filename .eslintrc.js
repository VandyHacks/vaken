// common eslint parser for ALL files that we use
// if you're looking for a client (especially React) or server lint rule
// go to the configs in their respective directories
module.exports = {
	extends: [
		'airbnb', // Airbnb style guide
		'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
		'plugin:promise/recommended',
		'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
		'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
	],
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	plugins: ['sort-keys-fix', 'promise'],
	rules: {
		'sort-keys-fix/sort-keys-fix': ['error', 'asc', { caseSensitive: true, natural: true }],
		'prettier/prettier': 'error',
		'no-param-reassign': [2, { props: true, ignorePropertyModificationsFor: ['draft'] }],
	},
};
