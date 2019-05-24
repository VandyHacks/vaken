const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = {
	context: __dirname, // to automagically find tsconfig.json
	entry: ['./src/client/index'],
	module: {
		rules: [
			{
				// Include ts, tsx, js, and jsx files.
				exclude: [/server/, /node_modules/],
				test: /\.(ts|js)x?$/,
				use: [
					{
						loader: 'thread-loader',
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
				oneOf: [
					{
						resourceQuery: /inline/,
						use: ['@svgr/webpack'],
					},
					{
						use: ['@svgr/webpack', 'file-loader'],
					},
				],
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
		filename: 'app.bundle.js',
		path: path.resolve(__dirname, 'dist/server/app'),
		publicPath: ASSET_PATH,
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
