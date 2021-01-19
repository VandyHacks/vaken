import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { ToggleSwitch } from './ToggleSwitch';

let container: HTMLDivElement | null = null;

describe('ToggleSwitch', () => {
	beforeEach(() => {
		container = document.createElement('div');
		document.body.appendChild(container);
	});

	afterEach(() => {
		if (container) document.body.removeChild(container);
		container = null;
	});

	it('Toggles on click', () => {
		let state = false;
		const setState = (newState: boolean): void => void (state = newState);

		if (!container) throw new Error('Container not properly set up in beforeEach');

		// Test first render and componentDidMount
		act(() => {
			ReactDOM.render(
				<ToggleSwitch label="TestButton" checked={state} onChange={setState} />,
				container
			);
		});

		const lever = container.querySelector('label > div') ?? document.createElement('div');
		// Test second render and componentDidUpdate
		act(() => {
			lever.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		expect(state).toBe(true);
	});
});
