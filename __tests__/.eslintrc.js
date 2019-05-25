// for tests ONLY
module.exports = {
	// NOTE: this stacks on top of common eslint rules
	rules: {
		'no-undef': 'off', // it() and describe() are always listed as undefined if this rule enabled
	},
	settings: {
		'import/resolver': {
			typescript: {}, // lets eslint resolve imports correctly
		},
	},
	parserOptions: {
		// fixes https://github.com/eslint/eslint/issues/4344
		ecmaVersion: 6,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
};
