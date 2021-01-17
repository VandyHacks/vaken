import React, { FC, useState, ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { XOR } from 'ts-xor';
import { Spinner, Wrapper as SpinnerWrapper } from '../Loading/Spinner';

/** Utility type which makes an exclusive OR of all properties in T.  */
type oneOf<T> = { [K in keyof T]: Pick<T, K> & FixTsUnion<T, K> }[keyof T];
type FixTsUnion<T, K extends keyof T> = { [Prop in keyof T]?: Prop extends K ? T[Prop] : never };

/** Exclusive OR between T, U, and V, factoring in all properties of each type. */
type XOR3<T, U, V> = XOR<XOR<T, U>, V>;

/** Returns true if the `url` param begins with "http" or "//", signifying an external url. */
function isAbsoluteUrl(url: string): boolean {
	return url.toLowerCase().startsWith('http') || url.startsWith('//');
}

type ButtonBase = {
	/** Text to render inside the button */
	children: string;

	/** Either an SVG element or a string to be used as an img tag src attribute */
	icon?: FC | string;

	/** Alt tag for icon. */
	iconAlt?: string;

	/** Gives a button significant padding on the left and right */
	long?: true;

	/** A disabled button will not have hover effects and can't be clicked. */
	disabled?: boolean;

	/** Underlying HTML button type */
	type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];

	/** Uses less eye-catching colors to signify this is not the preferred action. */
	secondary?: true;

	/** Aligns the button contents to the left side of the button rather than the center. */
	alignStart?: true;

	/** Uses red color for button to signify dangerous or data-loss inducing action. */
	warning?: true;
};

type ButtonArchetypes = {
	/**
	 * Shows a pill-shaped button that is filled with the accent color. Default.
	 * Mutually exclusive with `outline`.
	 */
	filled?: true;

	/**
	 * Shows a transparent button with a border around the outside edge
	 * Mutually exclusive with `filled`.
	 */
	outline: true;
};

type ButtonSizes = {
	/**
	 * Size in between small and large, likely the correct choice in most cases. Default.
	 * Mutually exclusive with `small` and `large`.
	 */
	default?: true;

	/**
	 * Smaller button which has no padding whatsoever around the text.
	 * Mutually exclusive with `default` and `large`.
	 */
	small: true;

	/**
	 * Larger button which has greater vertical padding and text size.
	 * Mutually exclusive with `default` and `small`.
	 */
	large: true;
};

type LinkButton = {
	/**
	 * Path to which clicking the button should take the user, relative to the domain root.
	 * The link may specify an external path starting by with the protocol (or protocol relative) `//domain.com/path`
	 */
	linkTo: string;

	/**
	 * Force the link handling behavior to use an `<a>` tag rather than internal PWA routing.
	 */
	externalLink?: true;
};

type PromiseButton = {
	/**
	 * Handler after the user clicks on the button.
	 * Should resolve to a promise if `async` is specified.
	 */
	onClick: () => Promise<unknown>;

	/** Shows loading dots after click until the onClick resolves */
	async?: true;

	/** Forces the loading state for the button */
	loading?: true;
};

type ClickButton = {
	/**
	 * Handler called after the user clicks on the button.
	 */
	onClick: () => void;
};

type ButtonActions = XOR3<LinkButton, PromiseButton, ClickButton>;

export type ButtonProps = ButtonBase & oneOf<ButtonArchetypes> & oneOf<ButtonSizes> & ButtonActions;

const StyledButton = styled.div<Omit<ButtonProps, 'children'>>`
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

export const Button: FC<ButtonProps> = props => {
	const [unresolved, setUnresolved] = useState(false);
	const { icon, iconAlt } = props;
	let Icon: FC | undefined;
	if (icon) {
		if (typeof icon === 'string') {
			const ButtonIcon: FC = () => <img src={icon} alt={iconAlt} />;
			Icon = ButtonIcon;
		} else {
			Icon = icon;
		}
	}
	let { onClick } = props;
	if (props.async) {
		// TypeScript can infer that onClick is set because of the `props.async`
		// type guard, but cannot guarantee that it'll be set inside the closure,
		// but capturing the reference here satisfies that guarantee.
		const delegatedClickHandler = props.onClick;
		onClick = () => {
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
	const { async, outline, small, large, loading, long, alignStart, secondary, disabled } = props;
	const { warning } = props;
	const classNames: string[] = [];
	if (outline) classNames.push('outline');
	else classNames.push('filled');
	if (small) classNames.push('small');
	if (large) classNames.push('large');
	if (loading || (async && unresolved)) classNames.push('loading');
	if (long) classNames.push('long');
	if (alignStart) classNames.push('align-start');
	if (secondary) classNames.push('secondary');
	if (disabled) classNames.push('disabled');
	if (warning) classNames.push('warning');
	const classes = classNames.join(' ');
	const { children, type = 'button', linkTo } = props;
	const element = (
		<StyledButton
			onClick={onClick}
			className={classes}
			role="button"
			type={type}
			secondary={secondary}>
			<div className="text">
				{Icon !== undefined ? <Icon /> : null}
				{children}
			</div>
			{async || loading ? <Spinner /> : null}
		</StyledButton>
	);
	if (linkTo) {
		const { externalLink } = props;
		return isAbsoluteUrl(linkTo) || externalLink ? (
			<a rel="noopener" href={linkTo}>
				{element}
			</a>
		) : (
			<Link to={linkTo}>{element}</Link>
		);
	}
	return element;
};

export default Button;
