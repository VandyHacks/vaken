// for the server ONLY
module.exports = {
	extends: ['airbnb', 'typescript', 'typescript/prettier'],
	rules: {
		'prettier/prettier': 'error',
	},
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
		'import/resolver': {
			typescript: {},
		},
	},
};
