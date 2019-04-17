module.exports = {
	extends: ['airbnb', 'typescript', 'typescript/react', 'typescript/prettier'],
	settings: {
		'import/resolver': {
			webpack: {
				config: 'webpack.dev.js',
			},
		},
	},
	plugins: ['sort-keys-fix'],
	rules: {
		'prettier/prettier': 'error',
		'sort-keys-fix/sort-keys-fix': [
			'error',
			'asc',
			{
				caseSensitive: true,
				natural: true,
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
	},
};
