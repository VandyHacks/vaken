// common eslint parser for ALL files that we use
// if you're looking for a client (especially React) or server lint rule
// go to the configs in their respective directories
module.exports = {
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	plugins: ['sort-keys-fix'],
	rules: {
		'sort-keys-fix/sort-keys-fix': ['error', 'asc', { caseSensitive: true, natural: true }],
	},
};
