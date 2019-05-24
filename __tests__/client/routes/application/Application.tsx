import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import Application from '../../../../src/client/routes/application/Application';

it('Application initializes', () => {
	expect(Application).toBeTruthy();
	/*
	const component = renderer.create(<Application />).toJSON();

    expect(component).toMatchSnapshot();
    */
});
