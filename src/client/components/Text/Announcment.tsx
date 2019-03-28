import React, { FunctionComponent, useState, useEffect } from 'react';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import STRINGS from '../../assets/strings.json';
import styled from 'styled-components';
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
    margin: 1.5rem;
    display: grid;
    grid-template-columns: 7rem auto;
    grid-template-rows: auto;
    grid-template-areas: 
      "image text"
`;

interface Props {
	value: string;
}

export const Announcement: FunctionComponent<Props> = (props: Props): JSX.Element => {
	return (
		<FloatingPopup
			borderRadius="1rem"
			width="35rem"
			backgroundOpacity="1"
			backgroundColor={STRINGS.ACCENT_COLOR}
			marginBottom="1rem"
			padding="0rem">
            <Layout>
                <AnnouncementImg src={Notification} />
                <Msg>{props.value}</Msg>
            </Layout>
		</FloatingPopup>
	);
};

export default Announcement;
