/*
// old mock for client, now unused b/c jest config split

import { JSDOM } from 'jsdom';
// from https://github.com/oliviertassinari/react-swipeable-views/issues/336#issuecomment-326807429
function createDOM() {
	const dom = new JSDOM('');
	global.document = dom.document;
	global.window = dom.window;
	global.root = dom.root;

	Object.keys(dom.window).forEach(property => {
		if (
			typeof global[property] === 'undefined' &&
			!['localStorage', 'sessionStorage'].includes(property)
		) {
			global[property] = dom.window[property];
		}
	});

	global.navigator = {
		userAgent: 'node.js',
	};
}
createDOM();
*/
