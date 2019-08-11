import React from 'react';
import renderer from 'react-test-renderer';
import { SchoolTable } from './OrganizerDash';

it('Test SchoolTable renders properly', async () => {
	// see https://www.apollographql.com/docs/react/recipes/testing

	const component = renderer
		.create(<SchoolTable data={[{ counts: 1, school: 'mockschool' }]} />)
		.toJSON();
	expect(component).toMatchSnapshot();
});
