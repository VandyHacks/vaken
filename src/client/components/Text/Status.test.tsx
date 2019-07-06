import React from 'react';
import renderer from 'react-test-renderer';

import { Status } from './Status';
import { HackerStatus } from '../../contexts/TableContext';

describe('Test Status', () => {
	it('renders correctly', async () => {
		const component = renderer
			.create(<Status value={HackerStatus.Confirmed} generateColor={() => 'mock'} />)
			.toJSON();
		expect(component).toMatchSnapshot();
	});
});
