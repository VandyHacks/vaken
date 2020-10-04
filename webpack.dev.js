const { merge } = require('webpack-merge');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
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
	module: {
		rules: [
			{
				// Include ts, tsx, js, and jsx files.
				test: /\.(ts|js)x?$/,
				exclude: [/server/, /node_modules/],
				use: [
					{
						loader: 'thread-loader',
						options: {
							poolTimeout: Infinity, // set this to Infinity in watch mode - see https://github.com/webpack-contrib/thread-loader
						},
					},
				],
			},
		],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(), // Auto-refresh on changes
		new ErrorOverlayPlugin(), // Error overlay in browser
		new FriendlyErrorsPlugin(), // Pretty console output
	],
});
