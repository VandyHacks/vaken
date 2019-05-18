import React from 'react';
import renderer from 'react-test-renderer';
import ActionButton from '../../../../src/client/components/Buttons/ActionButton';

// should probably test something onclick

it('ActionButton', () => {
	const component = renderer.create(<ActionButton />).toJSON();

	expect(component).toMatchSnapshot();
});
