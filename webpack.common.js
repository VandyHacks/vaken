const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const threadLoader = require('thread-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const ASSET_PATH = process.env.ASSET_PATH || '/';

threadLoader.warmup({
	workers: 2
}, [
	// modules to load
	// can be any module, i. e.
	'babel-loader',
]);

module.exports = {
	context: __dirname, // to automagically find tsconfig.json
	entry: ['./src/client/index'],
	stats: 'normal',
	module: {
		rules: [
			{
				// Include ts, tsx, js, and jsx files.
				exclude: [/server/, /node_modules/],
				test: /\.(ts|js)x?$/,
				use: [
					{
						loader: 'thread-loader',
						options: {
							workers: 2
						}
					},
					{
						loader: 'babel-loader',
					},
				],
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
	// optimization: {
	// 	splitChunks: {
	// 		cacheGroups: {
	// 			commons: {
	// 				chunks: 'all',
	// 				name: 'vendors',
	// 				test: /[\\/]node_modules[\\/]styled-components/,
	// 			},
	// 		},
	// 	},
	// },
	output: {
		filename: '[name].[contenthash].bundle.js',
		path: path.resolve(__dirname, 'dist/server/app'),
		publicPath: ASSET_PATH,
		crossOriginLoading: 'anonymous',
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }), // Check types asynchronously
		new HtmlWebpackPlugin({
			template: './src/client/index.html',
		}), // For index.html entry point
	],
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
	},
};
