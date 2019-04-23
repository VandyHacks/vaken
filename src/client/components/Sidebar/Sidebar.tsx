import React, { useContext } from 'react';
import styled from 'styled-components';
import { NavLink as UglyNavLink, withRouter } from 'react-router-dom';
import produce from 'immer';
// @ts-ignore
import SqLogo from '../../assets/img/square_hackathon_logo.svg?inline';
import STRINGS from '../../assets/strings.json';
import NavButton from '../Buttons/NavButton';
import { FlexStartColumn, SpaceBetweenColumn, FlexEndColumn } from '../Containers/FlexContainers';
import SmallCenteredText from '../Text/SmallCenteredText';
import { currentAuth, AuthLevel, routes } from '../../assets/routes';
import AuthContext from '../../contexts/AuthContext';

interface Props {}

const Layout = styled.div`
	grid-area: sidebar;
`;

const Background = styled.div`
	background: linear-gradient(254.59deg, #bd7ae3 0%, #8461c9 100%);
	width: 100%;
	height: 100vh;

	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-start;
	align-items: flex-start;
`;

const Logo = styled.div`
	margin: 3rem 2rem;
	width: min-content;
	align-self: center;
`;

const HorizontalLine = styled.hr`
	margin: 0 2rem;
	width: calc(100% - 4rem);
	border: 0.03125rem solid white;
	margin-bottom: 2rem;
`;

const HorizontalLineWithoutPad = styled.hr`
	margin: 0 2rem;
	width: calc(100% - 4rem);
	border: 0.03125rem solid white;
	opacity: 0.1;
`;

const HorizontalLineLogout = styled(HorizontalLine)`
	margin-top: 0;
	margin-bottom: 1rem;
`;

const NavButtonWhiteText = styled(NavButton)`
	color: white;
	font-weight: 100;
	font-size: 28pt;
	padding-left: 1.33rem;
`;

const ALink = styled.a`
	text-decoration: none;
	text-align: left;
	height: max-content;
	width: 100%;
	outline: 0 !important;

	&:focus,
	&:hover,
	&:visited,
	&:link,
	&:active {
		text-decoration: none;
		outline: 0 !important;
	}

	button:active,
	button:focus {
		outline: 0 !important;
	}

	button::-moz-focus-inner {
		border: 0;
	}
`;

const NavLink = ALink.withComponent(UglyNavLink);

interface Route {
	authLevel: string[];
	path: string;
	displayText: string;
}

const ColumnWithSeparators = styled.ul`
	width: 100%;

	li:not(:first-child):before {
		content: '';
		opacity: 0.2;
		background-color: white;
		height: 1px;
		width: calc(100% - 4rem);
		margin: 0 2rem;
		display: block;
	}

	.active {
		${NavButtonWhiteText} {
			font-weight: 400;
		}

		button {
			background: rgba(247, 245, 249, 0.1);
		}
	}
`;

const Sidebar = withRouter(
	(props: Props): JSX.Element => {
		const currentUser = useContext(AuthContext);
		return (
			<Layout>
				<Background>
					<Logo>
						<SqLogo />
					</Logo>
					<HorizontalLine />
					<SpaceBetweenColumn height="calc(100% - calc(8rem + 160px))">
						<ColumnWithSeparators>
							{routes.map((route: Route) => {
								return route.authLevel.includes(currentUser.authLevel) ? (
									<li key={route.path}>
										<NavLink to={route.path} activeClassName="active">
											<NavButtonWhiteText text={route.displayText} />
										</NavLink>
									</li>
								) : null;
							})}
						</ColumnWithSeparators>
						<FlexEndColumn height="min-content" paddingBottom="1rem">
							<ALink href="/api/logout">
								<NavButtonWhiteText text="Logout" />
							</ALink>
							<HorizontalLineLogout />
							<SmallCenteredText>{STRINGS.HACKATHON_TITLE}</SmallCenteredText>
						</FlexEndColumn>
					</SpaceBetweenColumn>
				</Background>
			</Layout>
		);
	}
);

export default Sidebar;
