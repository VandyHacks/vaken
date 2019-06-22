import React from 'react';
import renderer from 'react-test-renderer';
import { ActionButton } from '../../../../src/client/components/Buttons/ActionButton';

it('ActionButton', () => {
	const component = renderer.create(<ActionButton />).toJSON();

	expect(component).toMatchSnapshot();
});
