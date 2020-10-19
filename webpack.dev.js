const { merge } = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'source-map',
	devServer: {
		hot: true, // Enable hot module replacement
		open: false, // Do not open browser on 'npm start'
		quiet: true, // Pretty console output
		port: 8081,
		historyApiFallback: true,
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
			},
			'/graphql': {
				target: 'http://localhost:8080',
			},
		},
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(), // Auto-refresh on changes
		new FriendlyErrorsPlugin(), // Pretty console output
	],
});
