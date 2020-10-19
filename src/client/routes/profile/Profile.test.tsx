import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import { Profile } from './Profile';

describe('Test Profile', () => {
	it('renders correctly', async () => {
		const component = renderer
			.create(
				<MockedProvider>
					<Profile />
				</MockedProvider>
			)
			.toJSON();
		expect(component).toMatchSnapshot();
	});
});
