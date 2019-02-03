import styled from 'styled-components';

export const displayFlex = `
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: center;
`;

export const FlexRow = styled.div`
	${displayFlex}
	flex-flow: row nowrap;
`;

export const FlexStartContainer = styled.div`
	${displayFlex}
	justify-content: space-between;
	height: 10rem;
`;
