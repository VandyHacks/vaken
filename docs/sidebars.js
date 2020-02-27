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
			'dev/tooling',
			{
				type: 'category',
				label: 'Client',
				items: ['dev/client'],
			},
			{
				type: 'category',
				label: 'Server',
				items: ['dev/server', 'dev/routing'],
			},
			'dev/auth',
		],
		'Core Features': ['core/overview', 'core/hackertable'],
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
		Docusaurus: ['doc1', 'doc2', 'doc3'],
		Features: ['mdx'],
	},
};
