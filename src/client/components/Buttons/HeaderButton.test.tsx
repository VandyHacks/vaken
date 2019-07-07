import React from 'react';
import renderer from 'react-test-renderer';
import { HeaderButton } from './HeaderButton';

it('HeaderButton', () => {
	const component = renderer
		.create(
			<HeaderButton onClick={() => {}}>
				<div>child</div>
			</HeaderButton>
		)
		.toJSON();
	expect(component).toMatchSnapshot();
});
