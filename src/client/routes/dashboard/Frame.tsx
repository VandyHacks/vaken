import React, {
	useState,
	Suspense,
	FunctionComponent,
	useContext,
	FC,
	SetStateAction,
	useCallback,
} from 'react';
import styled from 'styled-components';
import { Switch, Redirect, Route } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import STRINGS from '../../assets/strings.json';
import { Title } from '../../components/Text/Title';
import routes from '../../assets/routes';
import { AuthContext } from '../../contexts/AuthContext';
import { SpaceBetweenRow, OverflowContainer } from '../../components/Containers/FlexContainers';
import { ActionButtonContext } from '../../contexts/ActionButtonContext';
import { UserType } from '../../generated/graphql';
import { HackerDash } from './HackerDash';
import { SponsorDash } from './SponsorDash';

export const OrganizerDash = React.lazy(() => import('./OrganizerDash'));

const Layout = styled.div`
	position: fixed;
	height: 100vh;
	width: 100vw;
	display: grid;
	background-color: #212529;
	grid:
		'sidebar . . .' 1.5rem
		'sidebar . header .' auto
		'sidebar . . .' 1.5rem
		'sidebar . content .' 1fr
		'sidebar . . .' 1.5rem
		/ 22rem 2rem 1fr 2rem;
	/* align-items: stretch; */
	overflow: hidden;

	.content {
		grid-area: content;
		max-height: 100%;
		border-radius: 8px;
		overflow: auto;
	}

	.header {
		grid-area: header;
	}

	.sidebar {
		grid-area: sidebar;
	}

	@media only screen and (max-width: 456px) {
		grid:
			'sidebar . . .' 1.5rem
			'sidebar . header .' auto
			'sidebar . . .' 1.5rem
			'sidebar . content .' 1fr
			'sidebar . . .' 1.5rem
			/ ${({ sidebar }: { sidebar: boolean }) => (sidebar ? '100% 0 0 0' : '0 2rem 1fr 2rem')};

		${({ sidebar }: { sidebar: boolean }) => (sidebar ? '' : '.sidebar { display: none; }')}
	}
`;

const Rectangle = styled.div`
	height: 0.4rem;
	width: 7.5rem;
	background: ${STRINGS.ACCENT_COLOR_DARK};

	@media screen and (max-width: 456px) {
		display: none;
	}
`;

const MenuIconButton = styled.button`
	background-color: rgba(247, 245, 249, 1);
	border-radius: 4px;
	z-index: 1;
	cursor: pointer;
	border: none;
	padding: 3px 6px;

	& div {
		width: 35px;
		height: 5px;
		background-color: ${STRINGS.ACCENT_COLOR_DARK};
		margin: 6px 0;
	}
	transform: scale(0.9);

	@media screen and (min-width: 457px) {
		display: none;
	}
`;

const MenuIcon: FC<{ open: boolean; setOpen: React.Dispatch<SetStateAction<boolean>> }> = ({
	open,
	setOpen,
}) => {
	return (
		<MenuIconButton type="button" onClick={() => setOpen(!open)}>
			<div className={`bar1${open ? ' change' : ''}`} />
			<div className={`bar2${open ? ' change' : ''}`} />
			<div className={`bar3${open ? ' change' : ''}`} />
		</MenuIconButton>
	);
};

const Frame: FunctionComponent = (): JSX.Element => {
	const currentUser = useContext(AuthContext);
	const [ActionButton, setActionButton] = useState<React.ReactNode>(null);
	const [menuOpen, setMenuOpen] = useState(false);

	const resetScroll: React.FocusEventHandler<HTMLDivElement> = useCallback(({ currentTarget }) => {
		// eslint-disable-next-line no-param-reassign
		currentTarget.scrollTop = 0;
		// eslint-disable-next-line no-param-reassign
		currentTarget.scrollTop = 0;
	}, []);

	if (window.location.pathname.startsWith('/login')) {
		return <Redirect to="/dashboard" />;
	}

	return (
		<ActionButtonContext.Provider value={{ ActionButton, update: setActionButton }}>
			<Layout onFocus={resetScroll} sidebar={menuOpen}>
				<div className="header">
					<SpaceBetweenRow>
						<MenuIcon open={menuOpen} setOpen={setMenuOpen} />
						<Title style={{ color: '#FF647C'}} margin="1.5rem 0rem 0rem">
							<Switch>
								{routes.map(route => {
									return route.authLevel.includes(currentUser.userType) ? (
										<Route key={route.path} path={route.path} render={() => route.displayText} />
									) : null;
								})}
								<Route path="/">Dashboard</Route>
							</Switch>
						</Title>
						{ActionButton || null}
					</SpaceBetweenRow>
					<Rectangle />
				</div>
				<Sidebar setMenuOpen={setMenuOpen} />
				<OverflowContainer className="content">
					<Suspense fallback={<div>Loading...</div>}>
						<Switch>
							{routes.map(route => {
								return route.authLevel.includes(currentUser.userType) ? (
									<Route key={route.path} path={route.path} render={() => <route.component />} />
								) : null;
							})}
							<Route path="/">
								{() => {
									switch (currentUser.userType) {
										case UserType.Organizer:
											return <OrganizerDash />;
										case UserType.Sponsor:
											return <SponsorDash />;
										case UserType.Hacker:
											return <HackerDash />;
										default:
											return <div>Dash not implemented for this user type.</div>;
									}
								}}
							</Route>
						</Switch>
					</Suspense>
				</OverflowContainer>
			</Layout>
		</ActionButtonContext.Provider>
	);
};

export default Frame;
