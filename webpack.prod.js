const merge = require('webpack-merge');
const common = require('./webpack.common.js');
// const SriPlugin = require('webpack-subresource-integrity');
const PacktrackerPlugin = require('@packtracker/webpack-plugin');

module.exports = merge.smart(common, {
	mode: 'production', // by default minifies w/ terser
	devtool: 'source-map',
	plugins: [
		// new SriPlugin({
		// 	hashFuncNames: ['sha384'],
		// 	enabled: true,
		// }),
		new PacktrackerPlugin({
			project_token: process.env.PACKTRACKER_TOKEN,
			upload: process.env.CI,
			fail_build: true,
		}),
	],
});
