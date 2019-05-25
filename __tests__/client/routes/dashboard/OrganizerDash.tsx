import React from 'react';
import renderer from 'react-test-renderer';
// import { ApolloProvider } from 'react-apollo';
// import { MockedProvider } from 'react-apollo/test-utils';
// import ApolloClient from 'apollo-boost';
import { SchoolTable } from '../../../../src/client/routes/dashboard/OrganizerDash';

// mock fetch
/*
global.fetch = jest.fn().mockImplementation(() =>
	Promise.resolve({
		ok: true,
		json: () => {
			message: 'hello world';
		},
	})
); */

it('Test SchoolTable renders properly', async () => {
	// see https://www.apollographql.com/docs/react/recipes/testing

	/*
	const mocks = [
		{
			request: {
				query: GET_STATISTICS,
				variables: { number: 5.0 },
			},
			result: {
				data: {
					getAllHackerStatuses: { id: '1' },
					getTopHackerSchools: { id: '1' },
					getAllHackerSizes: { id: '1' },
					getAllHackerGenders: { id: '1' },
				},
			},
		},
	];
    const client = new ApolloClient();
    */

	const component = renderer
		.create(<SchoolTable data={[{ counts: 1, school: 'mockschool' }]} />)
		.toJSON();
	expect(component).toMatchSnapshot();
});
