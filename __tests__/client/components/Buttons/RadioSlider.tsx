import React from 'react';
import renderer from 'react-test-renderer';
import { RadioSlider } from '../../../../src/client/components/Buttons/RadioSlider';

describe('Test RadioSlider', () => {
	it('RadioSlider renders correctly', async () => {
		const component = renderer
			.create(<RadioSlider option1="a" option2="b" option3="c" value="mock" />)
			.toJSON();

		expect(component).toMatchSnapshot();
	});
});
