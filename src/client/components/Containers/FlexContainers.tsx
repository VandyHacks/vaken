import styled from 'styled-components';

export interface ContainerProps {
	height?: string;
	width?: string;
	flex?: string;
	padding?: string;
	margin?: string;
	marginBottom?: string;
	marginTop?: string;
	marginRight?: string;
	marginLeft?: string;
	paddingBottom?: string;
	paddingTop?: string;
	paddingRight?: string;
	paddingLeft?: string;
	background?: string;
	justifyContent?: string;
	alignItems?: string;
}

export const displayFlex = `
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: center;
`;

export const FlexDiv = styled.div`
	display: flex;
	flex-flow: column nowrap;
	align-items: ${({ alignItems = 'center' }: ContainerProps): string => alignItems};
	justify-content: ${({ justifyContent = 'center' }: ContainerProps): string => justifyContent};
`;

export const FlexColumn = styled(FlexDiv)`
	height: ${({ height = '100%' }: ContainerProps): string => height};
	width: ${({ width = '100%' }: ContainerProps): string => width};
	padding: ${({ padding = '100%' }: ContainerProps): string => padding};
	padding-bottom: ${({ paddingBottom = '0' }: ContainerProps): string => paddingBottom};
	padding-top: ${({ paddingTop = '0' }: ContainerProps): string => paddingTop};
	padding-left: ${({ paddingLeft = '0' }: ContainerProps): string => paddingLeft};
	padding-right: ${({ paddingRight = '0' }: ContainerProps): string => paddingRight};
	margin: ${({ margin = '0' }: ContainerProps): string => margin};
	${({ background }: ContainerProps): string => (background ? `background: ${background};` : '')}
`;

export const FlexRow = styled(FlexColumn)`
	flex-flow: row nowrap;
`;

export const SpaceBetweenRow = styled(FlexRow)`
	justify-content: space-between;
`;

export const FlexStartColumn = styled(FlexColumn)`
	justify-content: flex-start;
`;

export const FlexEndColumn = styled(FlexColumn)`
	height: max-content;
	justify-content: flex-end;
`;

export const SpaceBetweenColumn = styled(FlexColumn)`
	justify-content: space-between;
`;

export const OverflowContainer = styled.div`
	max-height: 100%;
	max-width: 100%;
	overflow: auto;
`;
