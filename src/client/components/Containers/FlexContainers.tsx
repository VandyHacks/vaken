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
}

export const displayFlex = `
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: center;
`;

export const FlexColumn = styled.div`
  ${displayFlex} 
	height: ${(props: ContainerProps) => props.height || '100%'};
	width: ${(props: ContainerProps) => props.width || '100%'};
	padding: ${(props: ContainerProps) => props.padding || '100%'};
	padding-bottom: ${(props: ContainerProps) => props.paddingBottom || '0'};
	padding-top: ${(props: ContainerProps) => props.paddingTop || '0'};
	padding-left: ${(props: ContainerProps) => props.paddingLeft || '0'};
	padding-right: ${(props: ContainerProps) => props.paddingRight || '0'};
  margin: ${(props: ContainerProps) => props.margin || '0'};
  ${(props: ContainerProps) => (props.background ? 'background: ' + props.background + ';' : null)}
`;

export const FlexRow = styled(FlexColumn)`
	flex-flow: row nowrap;
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

// Copyright (c) 2019 Vanderbilt University
