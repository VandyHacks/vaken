import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import Vaken from './app';

describe('Test Vaken', () => {
	it('Vaken main app renders correctly', async () => {
		const component = renderer
			.create(
				<MockedProvider>
					<Vaken />
				</MockedProvider>
			)
			.toJSON();
		expect(component).toMatchSnapshot();
	});
});
