import styled from 'styled-components';

export interface GridColProps {
	gap?: string;
}

export const GridColumn = styled.div`
	display: grid;
	grid-auto-flow: row;
	grid-gap: ${({ gap = '0' }: GridColProps) => gap};
`;
