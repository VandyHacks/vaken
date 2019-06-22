import React from 'react';
import renderer from 'react-test-renderer';

import { Status } from '../../../../src/client/components/Text/Status';

describe('Test Status', () => {
	it('renders correctly', async () => {
		const component = renderer
			.create(<Status value="mock" generateColor={() => 'mock'} />)
			.toJSON();
		expect(component).toMatchSnapshot();
	});
});
