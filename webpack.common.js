const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = {
	context: __dirname, // to automagically find tsconfig.json
	entry: './src/client/index',
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
							// poolTimeout: Infinity, // set this to Infinity in watch mode - see https://github.com/webpack-contrib/thread-loader
							workers: require('os').cpus().length - 1, // Leave 1 worker for fork-ts-checker
						},
					},
					{
						loader: 'babel-loader',
						// query: {
						// 	plugins: [
						// 	  ['import', { libraryName: "antd", style: true }]
						// 	]
						//   }					
					},
				],
			},
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				use: ['file-loader'],
			},
			{
				test: /\.less$/,
				use: [{
					loader: "style-loader"
				}, {
					loader: "css-loader"
				}, {
					loader: "less-loader",
					options: {
						javascriptEnabled: true
					}
				}]
			},	
			{
				test: /\.css$/,
				use: ['style-loader','css-loader']
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

// Copyright (c) 2019 Vanderbilt University
