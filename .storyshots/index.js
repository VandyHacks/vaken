import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
import initStoryshots, { renderWithOptions } from '@storybook/addon-storyshots';

import 'jest-styled-components';
import { styleSheetSerializer } from 'jest-styled-components/serializer';
import { addSerializer } from 'jest-specific-snapshot';

// Work around https://github.com/storybookjs/storybook/issues/3286
jest.mock('@storybook/core/server', () => ({
	toRequireContext: require('@storybook/core/dist/server/preview/to-require-context')
		.toRequireContext,
}));

addSerializer(styleSheetSerializer);
registerRequireContextHook();

initStoryshots({
	test: renderWithOptions({
		createNodeMock: element => {
			// `react-test-renderer` and `react-selectable-fast` don't work well together
			// without the ability to add actual event listeners.
			if (element.type === 'div') {
				return document.createElement('div');
			}
		},
	}),
});
