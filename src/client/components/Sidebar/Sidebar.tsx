import React from 'react';
import styled from 'styled-components';
import { NavLink as UglyNavLink, withRouter } from 'react-router-dom';
import sqLogo from '../../assets/img/square_hackathon_logo.svg';
import STRINGS from '../../assets/strings.json';
import NavButton from '../Buttons/NavButton';
import { FlexStartColumn, FlexEndColumn } from '../Containers/FlexContainers';
import SmallCenteredText from '../Text/SmallCenteredText';

interface Props {}

const Layout = styled.div`
	grid-area: sidebar;
`;

const Background = styled.div`
	background: linear-gradient(254.59deg, #bd7ae3 0%, #8461c9 100%);
	width: 100%;
	height: 100%;

	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-start;
	align-items: flex-start;
`;

const Logo = styled.img`
	margin: 3rem 2rem;
	width: min-content;
	align-self: center;
`;

const HorizontalLine = styled.hr`
	margin: 1rem 2rem;
	width: calc(100% - 4rem);
	color: white;
`;

const HorizontalLineWithoutPad = styled.hr`
	margin: 0 2rem;
	width: calc(100% - 4rem);
	color: rgba(2);
`;

const NavButtonWhiteText = styled(NavButton)`
	color: white;
	font-weight: 100;
	font-size: 28pt;
`;

const NavLink = styled(UglyNavLink)`
	text-decoration: none;
	text-align: left;
	height: max-content;
	width: 100%;

	&:focus,
	&:hover,
	&:visited,
	&:link,
	&:active {
		text-decoration: none;
	}
`;

const Sidebar = withRouter(
	(props: Props): JSX.Element => {
		return (
			<Layout>
				<Background>
					<Logo src={'/' + sqLogo} alt={STRINGS.SQUARE_LOGO_ALT_TEXT} />
					<HorizontalLine />
					<FlexStartColumn>
						<NavLink to="/dashboard" activeStyle={{}}>
							<NavButtonWhiteText text="Dashboard" />
						</NavLink>
						<HorizontalLineWithoutPad />
						<NavLink to="/profile">
							<NavButtonWhiteText text="Profile" />
						</NavLink>
						<NavLink to="/application">
							<NavButtonWhiteText text="Application" />
						</NavLink>
						<NavLink to="/team">
							<NavButtonWhiteText text="Team" />
						</NavLink>
						<NavLink to="/help">
							<NavButtonWhiteText text="Help" />
						</NavLink>
					</FlexStartColumn>
					<FlexEndColumn paddingBottom="1rem">
						<NavLink to="/logout">
							<NavButtonWhiteText text="Logout" />
						</NavLink>
						<HorizontalLine />
						<SmallCenteredText>{STRINGS.HACKATHON_TITLE}</SmallCenteredText>
					</FlexEndColumn>
				</Background>
			</Layout>
		);
	}
);

export default Sidebar;
