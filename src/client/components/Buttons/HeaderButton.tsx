import React, { FC, useState, ButtonHTMLAttributes } from 'react';
import CSS from 'csstype';
import TextButton from './TextButton';
import STRINGS from '../../assets/strings.json';
import Spinner from '../Loading/Spinner';

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	onClick: () => void | Promise<unknown>;
	width?: CSS.Property.Width;
}

export const HeaderButton: FC<Props & { fontSize?: string }> = ({
	children,
	onClick,
	width,
	fontSize,
}) => {
	const [inAction, setInAction] = useState(false);
	const clickHandler: () => void = () => {
		const result = onClick();
		if (result && result.then) {
			setInAction(true);
			setTimeout(async () => {
				// Wait 700 ms or until the action completes, whichever comes later.
				// This prevents the quick flash of the loader, while also providing
				// feedback to the user.
				await result;
				setInAction(false);
			}, 700);
		}
	};

	return (
		<TextButton
			marginTop="0"
			marginBottom="0"
			marginRight="0.1rem"
			width={width || 'auto'}
			paddingLeft="2rem"
			paddingRight="2rem"
			paddingTop="0.6rem"
			paddingBottom="0.6rem"
			height="auto"
			color="white"
			fontSize={fontSize || '1.4rem'}
			background={STRINGS.ACCENT_COLOR}
			glowColor="rgba(0, 0, 255, 0.67)"
			onClick={clickHandler}>
			{inAction ? <Spinner color="white" /> : children}
		</TextButton>
	);
};

export default HeaderButton;
