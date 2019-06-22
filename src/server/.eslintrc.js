// for the server ONLY
module.exports = {
	// NOTE: this stacks on top of common eslint rules
	rules: {
		'no-underscore-dangle': 'off', // messes with mongo _id
		'no-param-reassign': 'off', // we often reassign "ctx" param properties for koa
		//-----------------------------------------------------------//
		// see https://github.com/bradzacher/eslint-plugin-typescript/blob/master/docs/rules/no-unused-vars.md#options
		'no-unused-vars': 'off', // disable base rule
		'@typescript-eslint/no-unused-vars': ['error', { vars: 'local' }], // local vars prevent exported enums from being declared unused
		// ---------------------------------------------------------//
	},
	plugins: ['@typescript-eslint'],
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
		'import/resolver': {
			typescript: {},
		},
	},
};
