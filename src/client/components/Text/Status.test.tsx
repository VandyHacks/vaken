import React from 'react';
import renderer from 'react-test-renderer';

import { Status } from './Status';
import { ApplicationStatus } from '../../generated/graphql';

describe('Test Status', () => {
	it('renders correctly', async () => {
		const component = renderer
			.create(<Status value={ApplicationStatus.Confirmed} generateColor={() => 'mock'} />)
			.toJSON();
		expect(component).toMatchSnapshot();
	});
});
