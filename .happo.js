const { RemoteBrowserTarget } = require('happo.io');
const happoPluginStorybook = require('happo-plugin-storybook');

module.exports = {
	apiKey: process.env.HAPPO_API_KEY,
	apiSecret: process.env.HAPPO_API_SECRET,

	targets: {
		'chrome-desktop': new RemoteBrowserTarget('chrome', {
			viewport: '1024x768',
		}),
		'chrome-mobile': new RemoteBrowserTarget('chrome', {
			viewport: '320x640',
		}),
	},

	plugins: [happoPluginStorybook()],
};
