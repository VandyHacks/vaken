import React from 'react';
import renderer from 'react-test-renderer';
// import { MemoryRouter } from 'react-router-dom';

import { Application } from './Application';

jest.mock('../../../../src/client/assets/data/institutions.json', () => ['Vanderbilt University']);

describe('Test Application', () => {
	it(' renders correctly', async () => {
		const component = renderer.create(<Application />).toJSON();
		expect(component).toMatchSnapshot();
	});
});
