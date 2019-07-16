const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const SriPlugin = require('webpack-subresource-integrity');
const PacktrackerPlugin = require('@packtracker/webpack-plugin');

module.exports = merge.smart(common, {
	mode: 'production',
	devtool: 'source-map',
	plugins: [
		new SriPlugin({
			hashFuncNames: ['sha384'],
			enabled: true,
		}),
		// only need this if we have a packtracker token in the env. That should only be CI.
		process.env.PACKTRACKER_TOKEN == null
			? {}
			: new PacktrackerPlugin({
					project_token: process.env.PACKTRACKER_TOKEN,
					upload: true,
					fail_build: true,
			  }),
	],
});
