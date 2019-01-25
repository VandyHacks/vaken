const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge.smart(common, {
	mode: 'production',
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.(gif|png|jpe?g)$/i,
				use: [
					'file-loader',
					{
						// Compress images
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								progressive: true,
								quality: 65,
							},
							// optipng.enabled: false will disable optipng
							optipng: {
								enabled: false,
							},
							pngquant: {
								quality: '65-90',
								speed: 4,
							},
							gifsicle: {
								interlaced: false,
							},
							// the webp option will enable WEBP
							webp: {
								quality: 75,
							},
						},
					},
				],
			},
		],
	},
});
