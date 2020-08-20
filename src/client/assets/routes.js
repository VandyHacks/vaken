import React from 'react';
import { Application } from '../routes/application/Application';
import { HackerDash } from '../routes/dashboard/HackerDash';
// import { Team } from '../routes/team/Team';
// import { Profile } from '../routes/profile/Profile';
import { Help } from '../routes/help/Help';
import { UserType } from '../generated/graphql';
import { packages, authLogos } from '../plugins';

const routes = [
	{
		authLevel: [UserType.Organizer],
		component: HackerDash,
		displayText: 'Dashboard',
		path: '/dashboard',
	},
	{
		authLevel: [UserType.Hacker, UserType.Volunteer],
		component: HackerDash,
		displayText: 'Dashboard',
		path: '/dashboard',
	},
	// {
	// 	authLevel: [UserType.Hacker, UserType.Sponsor, UserType.Organizer],
	// 	component: Profile,
	// 	displayText: 'Profile',
	// 	path: '/profile',
	// },
	{
		authLevel: [UserType.Sponsor],
		component: React.lazy(() => import('../routes/dashboard/SponsorDash')),
		displayText: 'Dashboard',
		path: '/dashboard',
	},
	{
		authLevel: [UserType.Hacker, UserType.Volunteer, UserType.Organizer],
		component: Application,
		displayText: 'Apply',
		path: '/application',
	},
	// {
	// 	authLevel: [UserType.Hacker],
	// 	component: Team,
	// 	displayText: 'Team',
	// 	path: '/team',
	// },
	{
		authLevel: [UserType.Organizer],
		component: React.lazy(() => import('../routes/manage/ManageHackers')),
		displayText: 'Manage Hackers',
		path: '/manage/hackers',
	},
	{
		authLevel: [UserType.Organizer],
		component: React.lazy(() => import('../routes/events/ManageEvents')),
		displayText: 'Manage Events',
		path: '/manage/events',
	},
	{
		authLevel: [UserType.Sponsor],
		component: React.lazy(() => import('../routes/manage/SponsorHackerView')),
		displayText: 'View Hackers',
		path: '/view/hackers',
	},
	{
		authLevel: [UserType.Organizer],
		component: React.lazy(() => import('../routes/manage/CreateSponsor')),
		displayText: 'Manage Sponsors',
		path: '/manage/sponsors',
	},
	{
		authLevel: [UserType.Hacker, UserType.Sponsor, UserType.Volunteer],
		component: Help,
		displayText: 'Help',
		path: '/help',
	},
	{
		authLevel: [UserType.Organizer, UserType.Volunteer, UserType.Sponsor],
		component: React.lazy(() => import('../routes/nfc/Nfc')),
		displayText: 'Scan NFC',
		path: '/nfc',
	},
];

packages.forEach(plugin => {
	routes.push({
		authLevel: plugin.routeInfo.authLevel,
		component: React.lazy(async () => plugin.component()),
		displayText: plugin.routeInfo.displayText,
		path: plugin.routeInfo.path,
	});
});

export default routes;
