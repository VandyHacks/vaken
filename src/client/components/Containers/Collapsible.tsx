import styled from 'styled-components';
import React, { FC } from 'react';
import { hexToRGB, Props as PopupProps } from './FloatingPopup';
import UpArrow from '../../assets/img/up_arrow.svg';
import STRINGS from '../../assets/strings.json';

/*
export const useMeasure = (): any => {
	const ref = useRef<any>();
	const [bounds, set] = useState({ height: 0, left: 0, top: 0, width: 0 });
	const [ro] = useState(() => new ResizeObserver(([entry]: any) => set(entry.contentRect)));
	useEffect(() => (ro.observe(ref.current), ro.disconnect), [ro]);
	return [{ ref }, bounds];
}; */

const CollapsibleHeader = styled.button`
	border-radius: 8px;
	background-color: ${STRINGS.BACKGROUND_DARK};
	color: ${STRINGS.ACCENT_COLOR_DARK};
	cursor: pointer;
	padding: 14px 1.4rem;
	width: 100%;
	border: none;
	text-align: left;
	outline: none;
	font-size: 2em;
	font-weight: bolder;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;

	img {
		transition: 0.5s all;
	}
	img.open {
		transform: rotate(-180deg);
	}
`;

const BGDiv = styled.div`
	background-color: rgba(
		${({ backgroundColor }: PopupProps): string =>
			backgroundColor ? hexToRGB(backgroundColor) : '247, 245, 249'},
		${({ backgroundOpacity = '1' }: PopupProps): string => backgroundOpacity}
	);
	border-radius: 8px;
	width: 100%;
`;

const CollapsibleBody = styled.div`
	max-height: 0;
	padding-left: 1.5rem;
	overflow: hidden;
	transition: all 0.2s ease-out;
	display: grid;
	grid-auto-flow: row;
	grid-gap: 1.4rem;
	max-width: 100%;

	&.active {
		padding: 1.5rem;
		max-height: 100%;
		overflow: visible;
	}
`;

export interface Props extends PopupProps {
	/** Will be hidden unless `open === true`, and will be exposed with animation when toggling open state. */
	children?: React.ReactNode;
	/** Triggers on clicking the title bar. Use to toggle open/closed state. */
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	open?: boolean;
	/** Displayed in the header of the collapsible. */
	title: string;
}

export const Collapsible: FC<Props> = (props: Props) => {
	const { open, children, title, ...rest } = props;

	return (
		<BGDiv>
			<CollapsibleHeader id={title} {...rest}>
				{title}
				<img src={UpArrow} className={open ? 'open' : ''} alt="arrow" />
			</CollapsibleHeader>
			<CollapsibleBody className={open ? 'active' : ''}>{children}</CollapsibleBody>
		</BGDiv>
	);
};

export default Collapsible;
