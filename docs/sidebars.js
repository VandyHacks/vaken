/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Note from [gfting]: Essentially, modify the code here in order to add new things to the sidebar as you add new actual files to the /docs folder.
 */

module.exports = {
	docs: {
		'Getting Started': ['introduction', 'installation'],
		Development: [
			'dev/overview',
			'dev/running',
			'dev/tooling',
			{
				type: 'category',
				label: 'Client',
				items: ['dev/client'],
			},
			{
				type: 'category',
				label: 'Server',
				items: ['dev/server', 'dev/graphql_and_mongodb'],
			},
			'dev/auth',
			'dev/folder_structure',
			'dev/testing_and_linting',
			'dev/developer_faq',
		],
		Learning: [
			'learning/overview',
			{
				type: 'category',
				label: 'Experience with Web-Dev',
				items: ['learning/webexp/overview'],
			},
			{
				type: 'category',
				label: 'No Experience with Web-Dev',
				items: ['learning/non-webexp/overview'],
			},
			'learning/case',
		],
		'Core Features': ['core/overview', 'core/application', 'core/hackertable'],
		Plugins: [
			'plugins/overview',
			{
				type: 'category',
				label: 'Existing',
				items: ['plugins/existing/nfc', 'plugins/existing/oauth'],
			},
			{
				type: 'category',
				label: 'Development',
				items: ['plugins/dev/overview'],
			},
		],
		'The Documentation': [
			'documentation/docusaurus',
			{
				type: 'category',
				label: 'Using Docusaurus',
				items: [
					'documentation/doc1',
					'documentation/doc2',
					'documentation/doc3',
					'documentation/mdx',
				],
			},
		],
	},
};
