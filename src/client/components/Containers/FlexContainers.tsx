import styled from 'styled-components';
import type CSS from 'csstype';

export type FlexDivProps = Pick<CSS.Properties, 'alignItems' | 'justifyContent'>;
export type ContainerProps = FlexDivProps &
	Pick<
		CSS.Properties,
		| 'background'
		| 'height'
		| 'margin'
		| 'marginBottom'
		| 'marginLeft'
		| 'marginRight'
		| 'marginTop'
		| 'padding'
		| 'paddingBottom'
		| 'paddingLeft'
		| 'paddingRight'
		| 'paddingTop'
		| 'width'
	>;

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
	height: ${({ height = '100%' }: ContainerProps) => height};
	width: ${({ width = '100%' }: ContainerProps) => width};
	padding: ${({ padding = '100%' }: ContainerProps) => padding};
	padding-bottom: ${({ paddingBottom = '0' }: ContainerProps) => paddingBottom};
	padding-top: ${({ paddingTop = '0' }: ContainerProps) => paddingTop};
	padding-left: ${({ paddingLeft = '0' }: ContainerProps) => paddingLeft};
	padding-right: ${({ paddingRight = '0' }: ContainerProps) => paddingRight};
	margin: ${({ margin = '0' }: ContainerProps) => margin};
	${({ background }: ContainerProps) => (background ? `background: ${background};` : '')}
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
	overflow: scroll;
`;
