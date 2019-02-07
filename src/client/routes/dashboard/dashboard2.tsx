import React from 'react';
import styled from 'styled-components';
import Sidebar from '../../components/Sidebar/Sidebar';

const Layout = styled.div`
	height: 100vh;
	width: 100vw;
	display: grid;
	grid:
		'sidebar header' 10vh
		'sidebar content' 1fr
		/ 18rem 1fr;
`;

const Dashboard2 = (): JSX.Element => {
	return (
		<>
			<Layout>
				<Sidebar />
			</Layout>
		</>
	);
};

export default Dashboard2;
