const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	context: __dirname, // to automagically find tsconfig.json
	entry: './src/client/index',
	output: {
		path: path.resolve(__dirname, 'dist/server/app'),
		filename: 'app.bundle.js',
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
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
							workers: require('os').cpus().length - 1, // Leave 1 worker for fork-ts-checker
						},
					},
					{
						loader: 'babel-loader',
					},
				],
			},
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				use: [
					'file-loader'
				],
			},
		],
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }), // Check types asynchronously
		new HtmlWebpackPlugin({
			template: './src/client/index.html',
		}), // For index.html entry point
	],
};
