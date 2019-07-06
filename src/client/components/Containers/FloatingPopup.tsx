import styled from 'styled-components';
import { FlexStartColumn, ContainerProps } from './FlexContainers';

export const hexToRGB = (hex: string): string => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `${r}, ${g}, ${b}`;
};

export interface Props extends ContainerProps {
	backgroundColor?: string;
	backgroundOpacity?: string;
	borderRadius?: string;
}

const FloatingPopup = styled(FlexStartColumn)`
	transition: ease-in-out all 1s;
	background-color: rgba(
		${({ backgroundColor }: Props): string =>
			backgroundColor ? hexToRGB(backgroundColor) : '247, 245, 249'},
		${({ backgroundOpacity = '1' }: Props): string => backgroundOpacity}
	);
	border-radius: ${({ borderRadius = '2rem' }: Props) => borderRadius};
	padding: ${({ padding = '1.5rem' }: Props) => padding};
	margin-bottom: ${({ marginBottom = '0' }: Props) => marginBottom};
	height: ${({ height = 'min-content' }: Props) => height};
	/* height: min-content; */
	box-sizing: border-box;
	${({ paddingTop }: Props): string => (paddingTop ? `padding-top: ${paddingTop};` : '')}
`;

/*
 export const AnimatedFloatingPopup: React.FunctionComponent<{ children: JSX.Element }> = (
	props
): JSX.Element => {
	const { children } = props;
	const [bind, { height }] = useMeasure();
	const springProps = useSpring({ height });
	const AFP = animated(FloatingPopup);

	return <AFP {...bind}>{children}</AFP>;
};
 */

export default FloatingPopup;
