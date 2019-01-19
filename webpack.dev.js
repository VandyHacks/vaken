const merge = require('webpack-merge');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		hot: true, // Enable hot module replacement
		open: true, // Open browser on 'npm start'
		quiet: true, // Pretty console output
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(), // Auto-refresh on changes
		new ErrorOverlayPlugin(), // Error overlay in browser
		new FriendlyErrorsPlugin(), // Pretty console output
	],
});