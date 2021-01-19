import type { FC } from 'react';
import type { XOR3, oneOf } from '../../../common/util';

/**
 * Using disjoint types as used in this file enables superior editor completion support.
 *
 * In any editor served by a real TS language server, adding attributes to a Button element at a
 * call site will narrow the scope of available auto-completions to only those that are possible
 * together with modifers that have already been put down.
 *
 * For example, adding the `async` attribute will prevent a user also adding the `linkTo`
 * attribute, which are mutually exclusive attributes by way of the XOR between `PromiseButton`
 * and `LinkButton`. Logically, these properties don't make sense together, as a `LinkButton` will
 * immediately change the view whereas a `PromiseButton` may show a loader until the promise is
 * resolved to indicate a long-running action. Likewise, the `PromiseButton` type ensures that
 * the `async` property being specified requires an `onClick` property returning a `Promise`,
 * whereas any function is allowed without `async`.
 *
 * Unfortunately, the TS Compiler has a small issue with the generated error message where it may
 * complain about an unrelated property (usually `outline`, in @leonm1's experience) being
 * incompatible. This indicates an issue with some mutually exclusive type being set.
 */

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
	disabled?: boolean; // boolean rather than `true` to allow setting this property using a variable

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
