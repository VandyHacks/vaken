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
		new PacktrackerPlugin({
			project_token: '11bc4903-960f-4a31-b6aa-65e13e351fa2',
			upload: true,
			fail_build: true,
		}),
	],
});
