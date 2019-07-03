// common eslint parser for ALL files that we use
// if you're looking for a client (especially React) or server lint rule
// go to the configs in their respective directories
module.exports = {
	extends: [
		'airbnb', // Airbnb style guide
		'plugin:promise/recommended',
		'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
	],
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	plugins: ['sort-keys-fix', 'promise'],
	rules: {
		'sort-keys-fix/sort-keys-fix': ['error', 'asc', { caseSensitive: true, natural: true }],
		'prettier/prettier': 'error',
		'no-param-reassign': [2, { props: true, ignorePropertyModificationsFor: ['draft'] }],
		'@typescript-eslint/no-explicit-any': 'off',
	},
};
