module.exports = {
	title: 'Vaken',
	tagline: 'Next-generation hackathon registration system.',
	url: 'https://your-docusaurus-test-site.com',
	baseUrl: '/',
	favicon: 'img/favicon.ico',
	organizationName: 'vandyhacks', // Usually your GitHub org/user name.
	projectName: 'vaken', // Usually your repo name.
	themeConfig: {
		navbar: {
			title: 'Vaken',
			logo: {
				alt: 'VandyHacks Logo',
				src: 'img/logo.svg',
				srcDark: 'img/logo_dark.svg',
			},
			links: [
				{ to: 'docs/installation', label: 'Docs', position: 'left' },
				// { to: 'blog', label: 'Blog', position: 'left' },
				{
					href: 'https://github.com/vandyhacks/vaken',
					label: 'GitHub',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'Docs',
					items: [
						{
							label: 'Installation',
							to: 'docs/installation',
						},
						{
							label: 'Core Features',
							to: 'docs/core/overview',
						},
					],
				},
				{
					title: 'Community',
					items: [
						// {
						// 	label: 'Stack Overflow',
						// 	href: 'https://stackoverflow.com/questions/tagged/docusaurus',
						// },
						{
							label: 'Slack',
							href:
								'https://join.slack.com/t/vanderbiltcsorgs/shared_invite/enQtOTczMjA1OTc0MTUxLTdlM2MzNDk0NWNlNGVhNzEwMjNmZWJlNDZiODk2NjlhOTU3NzVkMGM1ZGRhMGM5MTExZGQ1NWFmNjllODBiZWM',
						},
					],
				},
				{
					title: 'Social',
					items: [
						{
							label: 'Blog',
							to: 'blog',
						},
						{
							label: 'GitHub',
							href: 'https://github.com/vandyhacks/vaken',
						},
						{
							label: 'Twitter',
							href: 'https://twitter.com/vandyhacks',
						},
						{
							label: 'Instagram',
							href: 'https://www.instagram.com/vandyhacks/',
						},
					],
				},
			],
			copyright: `Copyright © ${new Date().getFullYear()} VandyHacks. Built with Docusaurus.`,
		},
		algolia: {
			apiKey: process.env.ALGOLIA_API_KEY,
			indexName: 'vaken',
			algoliaOptions: {}, // Optional, if provided by Algolia
		},
	},
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					editUrl: 'https://github.com/VandyHacks/vaken/tree/feat/documentation/docs', // FIXME:needs to get changed on launch
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			},
		],
	],
};
