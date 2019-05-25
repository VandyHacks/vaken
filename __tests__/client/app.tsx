import React from 'react';
import renderer from 'react-test-renderer';

import Vaken from '../../src/client/app';

describe('Test Vaken', () => {
	it('Vaken main app renders correctly', async () => {
		const component = renderer.create(<Vaken />).toJSON();
		expect(component).toMatchSnapshot();
	});
});
