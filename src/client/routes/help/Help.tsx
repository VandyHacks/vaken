import React from 'react';
import styled from 'styled-components';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import STRINGS from '../../assets/strings.json';
import { SmallCenteredText } from '../../components/Text/SmallCenteredText';

const Message = styled(SmallCenteredText)`
	white-space: pre-line;
`;

export const Help = (): JSX.Element => {
	const helpMessage = STRINGS.HELP_TEXT.split(STRINGS.HELP_EMAIL);

	return (
		<FloatingPopup borderRadius="1rem" width="35rem" backgroundOpacity="1" padding="1.5rem">
			<Message color={STRINGS.DARK_TEXT_COLOR} fontSize="1rem" margin="0rem">
				{helpMessage.length === 2 ? (
					<>
						{helpMessage[0]}
						<a href={`mailto:${STRINGS.HELP_EMAIL}`} id="mymailto">
							{STRINGS.HELP_EMAIL}
						</a>
						{helpMessage[1]}
					</>
				) : (
					STRINGS.HELP_TEXT
				)}
			</Message>
		</FloatingPopup>
	);
};

export default Help;
