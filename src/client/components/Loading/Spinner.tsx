import React, { FC } from 'react';
import styled from 'styled-components';
import STRINGS from '../../assets/strings.json';

interface StyleProps {
	color?: string;
}

const Wrapper = styled.div`
	& {
		margin: 0 auto 0rem;
		width: 4.375rem;
		text-align: center;
	}

	& > div {
		width: 1rem;
		height: 1rem;
		background-color: ${({ color }: StyleProps) => color || STRINGS.ACCENT_COLOR};

		border-radius: 100%;
		display: inline-block;
		-webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
		animation: sk-bouncedelay 1.4s infinite ease-in-out both;
	}

	& .bounce1 {
		-webkit-animation-delay: -0.32s;
		animation-delay: -0.32s;
	}

	& .bounce2 {
		-webkit-animation-delay: -0.16s;
		animation-delay: -0.16s;
	}

	@keyframes sk-bouncedelay {
		0%,
		80%,
		100% {
			-webkit-transform: scale(0);
			transform: scale(0);
		}
		40% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}
	}
`;

const Spinner: FC<StyleProps> = (props: StyleProps): JSX.Element => {
	return (
		<Wrapper {...props}>
			<div className="bounce1" />
			<div className="bounce2" />
			<div className="bounce3" />
		</Wrapper>
	);
};

export default Spinner;
