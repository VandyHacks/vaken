import React from 'react';
import ReactDOM from 'react-dom';

interface Props {}
interface State {
	boom: string;
}

class HelloWorld extends React.Component<Props, State> {
	public constructor(props: {}) {
		super(props);

		this.state = {
			boom: 'Hello World',
		};
	}

	public render() {
		const { boom } = this.state;
		return <div>{boom}</div>;
	}
}

const app = document.getElementById('App');
ReactDOM.render(<HelloWorld />, app);
