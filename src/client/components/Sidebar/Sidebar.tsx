import React from 'react';
import styled from 'styled-components';
import { NavLink as UglyNavLink, withRouter } from 'react-router-dom';
import produce from 'immer';
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
	margin-bottom: 2rem;
`;

const HorizontalLineWithoutPad = styled.hr`
	margin: 0 2rem;
	width: calc(100% - 4rem);
	color: white;
	opacity: 0.1;
`;

const NavButtonWhiteText = styled(NavButton)`
	color: white;
	font-weight: 100;
	font-size: 28pt;
	padding-left: 1.33rem;
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

enum AuthLevel {
	Hacker,
	Sponsor,
	Organizer,
}

interface Route {
	authLevel: AuthLevel[];
	path: string;
	displayText: string;
	component: string;
}

// TODO: Make routes part of config file
const routes = [
	{
		authLevel: [AuthLevel.Hacker, AuthLevel.Sponsor, AuthLevel.Organizer],
		displayText: 'Dashboard',
		path: '/dashboard',
	} as Route,
	{
		authLevel: [AuthLevel.Hacker, AuthLevel.Sponsor, AuthLevel.Organizer],
		displayText: 'Profile',
		path: '/profile',
	} as Route,
	{
		authLevel: [AuthLevel.Hacker],
		displayText: 'Application',
		path: '/application',
	} as Route,
	{
		authLevel: [AuthLevel.Hacker],
		displayText: 'Team',
		path: '/team',
	} as Route,
	{
		authLevel: [AuthLevel.Hacker, AuthLevel.Sponsor, AuthLevel.Organizer],
		displayText: 'Help',
		path: '/help',
	} as Route,
];

const Sidebar = withRouter(
	(props: Props): JSX.Element => {
		const userLevel = AuthLevel.Hacker;
		return (
			<Layout>
				<Background>
					<Logo src={'/' + sqLogo} alt={STRINGS.SQUARE_LOGO_ALT_TEXT} />
					<HorizontalLine />
					<FlexStartColumn>
						{routes.map((route: Route) => {
							return userLevel in route.authLevel ? (
								<NavLink
									key={route.path}
									to={route.path}
									activeStyle={{ background: 'rgba(247, 245, 249, 0.1)' }}>
									<NavButtonWhiteText text={route.displayText} />
									<HorizontalLineWithoutPad />
								</NavLink>
							) : null;
						})}
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
