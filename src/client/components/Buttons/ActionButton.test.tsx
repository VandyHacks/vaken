import React from 'react';
import renderer from 'react-test-renderer';
import { ActionButton } from './ActionButton';

it('ActionButton', () => {
	const component = renderer.create(<ActionButton />).toJSON();

	expect(component).toMatchSnapshot();
});
