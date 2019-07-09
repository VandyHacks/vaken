const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const SriPlugin = require('webpack-subresource-integrity');

module.exports = merge.smart(common, {
	mode: 'production',
	devtool: 'source-map',
	plugins: [
		new SriPlugin({
			hashFuncNames: ['sha384'],
			enabled: true,
		}),
	],
});
