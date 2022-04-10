module.exports = {
	core: {
		builder: 'webpack5',
	},
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-a11y',
		'@storybook/addon-actions',
		'@storybook/addon-essentials',
		'@storybook/addon-links',
		'@storybook/addon-storyshots',
		'storybook-addon-swc',
	],
};
