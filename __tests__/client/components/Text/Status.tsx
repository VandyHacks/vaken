import React from 'react';
import renderer from 'react-test-renderer';

import { Status } from '../../../../src/client/components/Text/Status';
import { HackerStatus } from '../../../../src/client/contexts/TableContext';

describe('Test Status', () => {
	it('renders correctly', async () => {
		const component = renderer
			.create(<Status value={HackerStatus.Confirmed} generateColor={() => 'mock'} />)
			.toJSON();
		expect(component).toMatchSnapshot();
	});
});
