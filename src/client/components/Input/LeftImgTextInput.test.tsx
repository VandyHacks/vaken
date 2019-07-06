import React from 'react';
import renderer from 'react-test-renderer';
import LeftImgTextInput from './LeftImgTextInput';

describe('Test LeftImgTextInput', () => {
	it('LeftImgTextInput renders correctly', async () => {
		const component = renderer
			.create(<LeftImgTextInput setState={() => {}} img="a" imgAlt="b" value="c" invalid={false} />)
			.toJSON();

		expect(component).toMatchSnapshot();
	});
});
