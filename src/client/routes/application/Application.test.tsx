import React from 'react';
import renderer from 'react-test-renderer';

import { Application } from './Application';

jest.mock('../../assets/data/institutions.json', () => ['Vanderbilt University']);

describe('Test Application', () => {
	it(' renders correctly', async () => {
		const component = renderer.create(<Application />).toJSON();
		expect(component).toMatchSnapshot();
	});
});
