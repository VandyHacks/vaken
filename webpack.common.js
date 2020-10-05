const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = {
	context: __dirname, // to automagically find tsconfig.json
	entry: ['./src/client/index'],
	stats: 'minimal',
	module: {
		rules: [
			{
				// Include ts, tsx, js, and jsx files.
				exclude: [/server/, /node_modules/],
				test: /\.(ts|js)x?$/,
				use: ['babel-loader'],
			},
			{
				test: /\.(gif|png|jpe?g)$/i,
				use: ['file-loader'],
			},
			{
				test: /\.svg$/,
				use: ['@svgr/webpack', 'file-loader'],
			},
			{
				include: /node_modules/,
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	output: {
		filename: '[name].[contenthash].bundle.js',
		path: path.resolve(__dirname, 'dist/src/server/app'),
		publicPath: ASSET_PATH,
		crossOriginLoading: 'anonymous',
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin({
			eslint: { enabled: true, files: ['src/'] },
			typescript: { enabled: true },
		}), // Check types asynchronously
		new HtmlWebpackPlugin({
			template: './src/client/index.html',
		}), // For index.html entry point
	],
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
		alias: {
			react: 'preact/compat',
			'react-dom/test-utils': 'preact/test-utils',
			'react-dom': 'preact/compat',
		},
	},
};
