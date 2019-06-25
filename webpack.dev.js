const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const webpack = require('webpack');
const common = require('./webpack.common.js');

// Validate env vars
if (!process.env.CLIENT_PORT) throw 'CLIENT_PORT not set';
if (!process.env.SERVER_PORT) throw 'SERVER_PORT not set';

module.exports = merge.smart(common, {
	devServer: {
		historyApiFallback: true, // Enable hot module replacement
		host: '0.0.0.0', // Open browser on 'npm start'
		hot: false, // Pretty console output
		open: false,
		port: process.env.CLIENT_PORT,
		proxy: {
			'/api': {
				target: `http://server:${process.env.SERVER_PORT}`,
			},
			'/graphql': {
				target: `http://server:${process.env.SERVER_PORT}`,
			},
		},
		quiet: true,
	},
	devtool: 'inline-source-map',
	mode: 'development',
	plugins: [
		new webpack.HotModuleReplacementPlugin(), // Auto-refresh on changes
		new FriendlyErrorsPlugin(), // Pretty console output
	],
});
