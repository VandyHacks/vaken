import React, { FunctionComponent, useState, useRef, useEffect } from 'react';
import styled, { StyledFunction } from 'styled-components';
import STRINGS from '../../assets/strings.json';

interface Props {
	option1: string;
	option2: string;
	option3: string;
}

interface SelectorProps {
    width: string;
    left: string;
    color: string;
}

const Wrapper = styled('div')`
	margin: auto;
	height: 1.5rem;
	line-height: 1.5rem;
	border-radius: 0.25rem;
	background: #ccc;
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

// const selector: StyledFunction<SelectorProps & React.HTMLProps<HTMLDivElement>> = styled('div');

// left: ${(props: SelectorProps) => `${props.left} px;`}
// ${({ width }: SelectorProps) => `left: ${width};`}
const Selector = styled('div')`
    left: ${(props: SelectorProps) => `${props.left};`}
	text-align: center;
	position: absolute;
	width: ${(props: SelectorProps) => `${props.width};`}
	box-sizing: border-box;
	transition: 300ms ease-out;
	border-radius: 0.3em;
	color: white;
    box-shadow: 0px 2px 13px 0px #9b9b9b;
    background-color: ${(props: SelectorProps) => `${props.color};`};
`;

export const RadioSlider: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const option1Ref = useRef<HTMLDivElement>(null);
	const option2Ref = useRef<HTMLDivElement>(null);
	const option3Ref = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState(props.option2);
    const [width, setWidth] = useState(0);
    const [left, setLeft] = useState(0);
    const [color, setColor] = useState(STRINGS.ACCENT_COLOR);
    const [isLoaded, setIsLoaded] = useState(false);

	//  setSelectedWidth(option2Ref && option2Ref.current && option2Ref.current.clientWidth || 0); // }, []);
	// const [selected, setSelected] = useState(props.option2);

	useEffect(() => {
        // console.log(props.option1, option1Ref.current.clientWidth);
        // console.log(props.option2, option2Ref.current.clientWidth);
        // console.log(props.option3, option3Ref.current.clientWidth);
        if (option2Ref.current != null) {
            setWidth(option2Ref.current.clientWidth);
        }
        // console.log(option2Ref.current.clientWidth);
        if (option1Ref.current != null) {
            setLeft(option1Ref.current.clientWidth);
        }
        // console.log(option1Ref.current.clientWidth);
        setIsLoaded(true);
    }, []);

	const onClick = (event: any) => {
        switch(event.target.id) {
            case(props.option1):
                // console.log("1: ", props.option1);
                if (option1Ref.current != null) {
                    setWidth(option1Ref.current.clientWidth);
                    setLeft(0);
                    setColor('#00C48C');
                }
                break;
            case(props.option2):
                // console.log("2: ", props.option2);
                if (option2Ref.current != null && option1Ref.current != null) {
                    setWidth(option2Ref.current.clientWidth);
                    setLeft(option1Ref.current.clientWidth);
                    setColor(STRINGS.ACCENT_COLOR);
                }
                break;
            case(props.option3):
                // console.log("3: ", props.option3);
                if (option1Ref.current != null && option2Ref.current != null && option3Ref.current != null) {
                    setWidth(option3Ref.current.clientWidth);
                    setLeft(option1Ref.current.clientWidth + option2Ref.current.clientWidth);
                    setColor('#FF647C');
                }
                break;
        }
        console.log("width: ", width);
        console.log("left: ", left);

		// setLeft(option1Ref && option1Ref.current && option1Ref.current.clientWidth || 0);
		// console.log(event.target.clientWidth);
		// console.log(selectedWidth);
		// console.log(option1Ref && option1Ref.current && option1Ref.current.clientWidth);
		// console.log(event.target.id);
		setSelected(event.target.id);
	};

	return (
		<Wrapper>
			<Switch id={props.option1} onClick={onClick} ref={option1Ref}>
				{props.option1}
			</Switch>
			<Switch id={props.option2} onClick={onClick} ref={option2Ref}>
				{props.option2}
			</Switch>
			<Switch id={props.option3} onClick={onClick} ref={option3Ref}>
				{props.option3}
			</Switch>
            {isLoaded && <Selector left={`${left}px`} width={`${width}px`} color={color}>{selected}</Selector>}
		</Wrapper>
	);
};

export default RadioSlider;
