import React, { useState, useEffect, useCallback, FC } from 'react';
import styled from 'styled-components';
import STRINGS from '../../assets/strings.json';

export interface Props {
	disable?: boolean;
	large?: boolean;
	onChange?: (input: string) => void;
	option1: string;
	option2: string;
	option3: string;
	value: string;
}

interface SelectorProps {
	color: string;
	left: string;
	width: string;
}

interface WrapperProps {
	disable: boolean;
	large: boolean;
}

const Wrapper = styled('div')`
	cursor: pointer;
	margin: auto;
	height: ${({ large }: WrapperProps): string => (large ? '3.0rem' : '1.5rem')};
	line-height: ${({ large }: WrapperProps): string => (large ? '3.0rem' : '1.5rem')};
	border-radius: 0.25rem;
	background: ${({ disable }: WrapperProps): string => (!disable ? '#ccc' : '#B0B0B0')};
	position: relative;
	display: block;
	float: left;
`;

const Switch = styled('div')`
	cursor: pointer;
	position: relative;
	display: block;
	float: left;
	transition: 300ms ease-out;
	padding: 0 0.75rem;
`;

const Selector = styled('div')`
	left: ${({ left }: SelectorProps): string => left};
	text-align: center;
	position: absolute;
	width: ${({ width }: SelectorProps): string => width};
	box-sizing: border-box;
	transition: 300ms ease-out;
	border-radius: 0.225rem;
	color: white;
	box-shadow: 0px 0.125rem 0.625rem 0px #9b9b9b;
	background-color: ${({ color }: SelectorProps): string => color};
`;

const disabledColor = '#696969';

export const RadioSlider: FC<Props> = (props: Props) => {
	const { option1, option2, option3, disable = false } = props;
	const [selected, setSelected] = useState(option2);
	const [width, setWidth] = useState(0);
	const [left, setLeft] = useState(0);
	const [color, setColor] = useState(!disable ? STRINGS.ACCENT_COLOR : disabledColor);
	const [isLoaded, setIsLoaded] = useState(false);
	const [option1Width, setOption1Width] = useState(0);
	const [option2Width, setOption2Width] = useState(0);
	const [option3Width, setOption3Width] = useState(0);

	// Defines the width after the node as been loaded in the Node
	const option1Ref = useCallback((node): void => {
		if (node !== null) {
			setOption1Width(node.getBoundingClientRect().width);
		}
	}, []);
	const option2Ref = useCallback((node): void => {
		if (node !== null) {
			setOption2Width(node.getBoundingClientRect().width);
		}
	}, []);
	const option3Ref = useCallback((node): void => {
		if (node !== null) {
			setOption3Width(node.getBoundingClientRect().width);
		}
	}, []);

	// Moves the selector to the correct place, with the correct colors
	// Takes into account the disable state
	const toggle = useCallback(
		(input: string): void => {
			switch (input) {
				case option1:
					setWidth(option1Width);
					setLeft(0);
					setColor(!disable ? '#00C48C' : disabledColor);
					break;
				case option2:
					setWidth(option2Width);
					setLeft(option1Width);
					setColor(!disable ? STRINGS.ACCENT_COLOR : disabledColor);
					break;
				case option3:
					setWidth(option3Width);
					setLeft(option1Width + option2Width);
					setColor(!disable ? '#FF647C' : disabledColor);
					break;
				default:
			}
			setSelected(input);
		},
		[option1, disable, option2, option3, option1Width, option2Width, option3Width]
	);

	const { value } = props;
	// Forces a retoggle when the props.value changes (ie for outside changes)
	useEffect((): void => {
		if (isLoaded) {
			toggle(value);
		}
	}, [isLoaded, value, toggle]);

	// Will set isLoaded = true once the widths are successfully taken (ie non-zero) from the switch elements
	useEffect((): void => {
		if (isLoaded === false && option1Width && option2Width && option3Width) {
			toggle(value);
			setIsLoaded(true);
		}
	}, [isLoaded, option1Width, option2Width, option3Width, value, toggle]);

	const { onChange = null } = props;
	const onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
		const target = event.target as HTMLDivElement;
		if (!disable) {
			toggle(target.id);
			if (typeof onChange === 'function') {
				onChange(target.id);
			}
		}
	};

	const { large = false } = props;
	// Selector's onClick works to allow you to click the middle button if it is already selected by default for the large button
	return (
		<Wrapper large={large} disable={disable}>
			<Switch id={option1} onClick={onClick} ref={option1Ref}>
				{option1}
			</Switch>
			<Switch id={option2} onClick={onClick} ref={option2Ref}>
				{option2}
			</Switch>
			<Switch id={option3} onClick={onClick} ref={option3Ref}>
				{option3}
			</Switch>
			{isLoaded && (
				<Selector
					left={`${left}px`}
					width={`${width}px`}
					color={color}
					id={selected}
					onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
						if (large) onClick(event);
					}}>
					{selected}
				</Selector>
			)}
		</Wrapper>
	);
};

export default RadioSlider;
