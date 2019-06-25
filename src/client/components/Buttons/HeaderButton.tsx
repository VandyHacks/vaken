import React from 'react';
import TextButton from './TextButton';
import STRINGS from '../../assets/strings.json';

export const HeaderButton: React.FunctionComponent<{
	onClick: () => void;
	text: string;
}> = props => {
	return (
		<TextButton
			{...props}
			marginTop="0"
			marginBottom="0"
			marginRight="0.1rem"
			width="auto"
			paddingLeft="2rem"
			paddingRight="2rem"
			paddingTop="0.6rem"
			paddingBottom="0.6rem"
			height="auto"
			color="white"
			fontSize="1.4rem"
			background={STRINGS.ACCENT_COLOR}
			glowColor="rgba(0, 0, 255, 0.67)"
		/>
	);
};

export default HeaderButton;
