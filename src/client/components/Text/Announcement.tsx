import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import FloatingPopup from '../Containers/FloatingPopup';
import { ACCENT_COLOR } from '../../assets/strings';
import Notification from '../../assets/img/notification.svg';

const Msg = styled.p`
	font-size: 1rem;
	color: #ffffff;
	white-space: pre-line;
	grid-area: text;
	padding-left: 1.5rem;
`;

const AnnouncementImg = styled.img`
	width: 7rem;
	grid-area: image;
`;

const Layout = styled.div`
	display: grid;
	grid-template-columns: 7rem auto;
	grid-template-rows: auto;
	grid-template-areas: 'image text';
`;

export interface Props {
	value: string;
}

export const Announcement: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const { value } = props;

	return (
		<FloatingPopup
			borderRadius="1rem"
			width="35rem"
			backgroundOpacity="1"
			backgroundColor={ACCENT_COLOR}
			marginBottom="1rem"
			padding="1.5rem">
			<Layout>
				<AnnouncementImg src={Notification} />
				<Msg>{value}</Msg>
			</Layout>
		</FloatingPopup>
	);
};

export default Announcement;
