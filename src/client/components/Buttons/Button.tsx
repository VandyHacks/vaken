import React, { FC, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styled from 'styled-components';
import { Spinner, Wrapper as SpinnerWrapper } from '../Loading/Spinner';
import { ButtonProps } from './Button.d';

/** Returns true if the `url` param begins with "http" or "//", signifying an external url. */
function isAbsoluteUrl(url: string): boolean {
	return url.toLowerCase().startsWith('http') || url.startsWith('//');
}

const StyledButton = styled.div`
	&.filled {
		--button-color: ${props => props.theme.colors.main};
		--text-color: ${props => props.theme.colors.lightTextColor};
		--glow-color: ${props => `${props.theme.colors.main}aa`};
		--border-color: var(--button-color);
		&.secondary {
			--button-color: ${props => props.theme.colors.lightTextColor};
			--text-color: ${props => props.theme.colors.darkTextColor};
			--glow-color: ${props => props.theme.colors.lightTextColor};
		}
		&.warning {
			--button-color: ${props => props.theme.colors.warning};
			--text-color: ${props => props.theme.colors.lightTextColor};
			--glow-color: ${props => `${props.theme.colors.warning}aa`};
		}
	}
	&.outline {
		--button-color: 'transparent';
		--text-color: ${props => props.theme.colors.main};
		--glow-color: ${props => props.theme.colors.lightTextColor};
		--border-color: var(--text-color);
		&.secondary {
			--text-color: ${props => props.theme.colors.darkTextColor};
		}
		&.warning {
			--text-color: ${props => props.theme.colors.warning};
		}
	}
	color: var(--text-color);
	background-color: var(--button-color);
	border: 2px solid var(--border-color);
	&:not(.disabled):hover,
	&:not(.disabled):active {
		box-shadow: 0rem 0rem 15px 0rem var(--glow-color);
		outline: none;
	}

	&.filled ${SpinnerWrapper} > div {
		/* 
		 * Spinner defaults to accent color loading dots. Override this for accent-
		 * colored filled buttons, where they will be invisible. 
		 */
		background-color: var(--text-color);
	}

	border-radius: ${props => props.theme.borderRadius};
	box-sizing: border-box;
	outline: none;
	text-align: center;

	cursor: pointer;
	&.disabled {
		cursor: not-allowed;
	}

	/* Prevents button from stretching when placed in flex containers. */
	flex: 0 0 auto;

	/* Enables stacking loader on top of text for proper sizing. */
	display: grid;
	grid-template-rows: 1fr;
	grid-template-columns: 1fr;
	grid-template-areas: 'content';

	padding: 0.75rem 1.5rem;
	font-size: 1rem;
	&.small {
		padding: 0.1rem 0.2rem;
		font-size: 0.85rem;
	}
	&.large {
		padding: 1rem 2rem;
		font-size: 1.4rem;
	}

	width: max-content;
	&.long {
		width: 23.33rem; /* Legacy value that @leonm1 liked in 2018 */
	}
	max-width: 100%;

	& ${SpinnerWrapper} {
		grid-area: content;

		/* 
		 * Spinner may be larger than the text, so this forces the button to auto size
		 * to show either label rather than re-sizing when loader appears. 
		 */
		visibility: hidden;
	}

	&.loading {
		.text {
			visibility: hidden;
		}
		${SpinnerWrapper} {
			visibility: visible;
		}
	}

	& img {
		max-height: 2ch;
		max-width: 2ch;
		margin-right: 1em;
	}

	& .text {
		display: flex;
		align-items: center;
		/* 
		 * The loader and text should stack on top of each other, 
		 * only one or the other will be visible 
		 */
		grid-area: content;

		justify-content: center;
	}
	&.align-start .text {
		justify-content: flex-start;
	}
`;

const getIcon = (
	IconProp: ButtonProps['icon'],
	iconAlt: ButtonProps['iconAlt']
): JSX.Element | null => {
	let Icon: JSX.Element | null = null;
	if (IconProp) {
		if (typeof IconProp === 'string') {
			const ButtonIcon: FC = () => <img src={IconProp} alt={iconAlt} />;
			Icon = <ButtonIcon />;
		} else {
			Icon = <IconProp />;
		}
	}
	return Icon;
};

/** For `async` buttons, wraps the click handler to toggle loading animation.  */
const getHandler = (
	onClick: ButtonProps['onClick'],
	async: ButtonProps['async'],
	setUnresolved: React.Dispatch<React.SetStateAction<boolean>>
): ButtonProps['onClick'] => {
	if (async && onClick) {
		const delegatedClickHandler = onClick;
		return () => {
			const result = delegatedClickHandler();
			setUnresolved(true);
			setTimeout(async () => {
				// Wait 700 ms or until the action completes, whichever comes later.
				// This prevents the quick flash of the loader, while also providing
				// feedback to the user.
				await result;
				setUnresolved(false);
			}, 700);
		};
	}
	return onClick;
};

const getClassNames = (props: ButtonProps, unresolved: boolean): string =>
	classNames({
		filled: props.filled || !props.outline,
		outline: props.outline,
		small: props.small,
		large: props.large,
		loading: props.loading || unresolved,
		long: props.long,
		'align-start': props.alignStart,
		secondary: props.secondary,
		disabled: props.disabled,
		warning: props.warning,
	});

/**
 * Flexible Button element with support for loading animation, primary/secondary styles,
 * filled/outline styles, disabled attribute, and link funtionality.
 */
export const Button: FC<ButtonProps> = props => {
	const [unresolved, setUnresolved] = useState(false);

	const { icon, iconAlt } = props;
	const iconElement = useMemo(() => getIcon(icon, iconAlt), [icon, iconAlt]);

	const { async, onClick } = props;
	const handler = useMemo(() => getHandler(onClick, async, setUnresolved), [async, onClick]);

	const classes = getClassNames(props, unresolved);

	const { children, loading } = props;
	const buttonElement = (
		<StyledButton onClick={handler} className={classes} role="button">
			<div className="text">
				{iconElement}
				{children}
			</div>
			{async || loading ? <Spinner /> : null}
		</StyledButton>
	);

	// Rather than handle in onClick, native DOM elements have better a11y support.
	// Use an `<a>` tag for external links as `<Link>` doesn't support them.
	const { linkTo, externalLink } = props;
	if (linkTo && (externalLink || isAbsoluteUrl(linkTo))) {
		return (
			<a href={linkTo} rel="noopener">
				{buttonElement}
			</a>
		);
	}
	if (linkTo) return <Link to={linkTo}>{buttonElement}</Link>;
	return buttonElement;
};
