import React from 'react';
import {
	onChangeWrapper,
	formChangeWrapper,
	checkValid,
	regexWrapper,
} from '../../../../src/client/components/Input/helperFunctions';

const MOCK_CB = jest.fn();
beforeEach(() => {
	// reset each time
	jest.clearAllMocks();
});

describe('Test Helper functions', () => {
	const event = ({
		target: {
			data: 'mock',
		},
	} as unknown) as React.ChangeEvent<HTMLInputElement>;

	it('test onChangeWrapper', async () => {
		await onChangeWrapper(MOCK_CB)(event);
		expect(MOCK_CB.mock.calls.length).toBe(1); // called once
	});
	it('test formChangeWrapper', async () => {
		await formChangeWrapper(MOCK_CB, '', '')(event);
		expect(MOCK_CB.mock.calls.length).toBe(1); // called once
	});
	it('test checkValid for empty case', async () => {
		expect(checkValid<string>('', () => true)()).toBe(true);
	});
	it('test regexWrapper for empty case', async () => {
		expect(regexWrapper('')('')).toBe(true);
	});
});
