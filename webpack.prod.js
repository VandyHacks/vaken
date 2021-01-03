const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
// const SriPlugin = require('webpack-subresource-integrity');
// const PacktrackerPlugin = require('@packtracker/webpack-plugin');

module.exports = merge(common, {
	mode: 'production', // by default minifies w/ terser
	devtool: 'source-map',
});
