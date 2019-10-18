import React from 'react';
import { SponsorPage } from '../routes/manageSponsor/CreateSponsor';
import { Application } from '../routes/application/Application';
import { HackerDash } from '../routes/dashboard/HackerDash';
import { SponsorDash } from '../routes/dashboard/SponsorDash';
import { ManageHackers } from '../routes/manage/ManageHackers';
import ManageEvents from '../routes/manage/ManageEvents';
import { SponsorHackerView } from '../routes/manage/SponsorHackerView';
// import { Team } from '../routes/team/Team';
// import { Profile } from '../routes/profile/Profile';
import { Help } from '../routes/help/Help';
import { Nfc } from '../routes/nfc/Nfc';
import { UserType } from '../generated/graphql';

const routes = [
	{
		authLevel: [UserType.Organizer],
		component: React.lazy(() => import('../routes/dashboard/OrganizerDash')),
		displayText: 'Dashboard',
		path: '/dashboard',
	},
	{
		authLevel: [UserType.Hacker],
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
		component: SponsorDash,
		displayText: 'Dashboard',
		path: '/dashboard',
	},
	{
		authLevel: [UserType.Hacker],
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
		component: ManageHackers,
		displayText: 'Manage Hackers',
		path: '/manage/hackers',
	},
	{
		authLevel: [UserType.Organizer],
		component: ManageEvents,
		displayText: 'Manage Events',
		path: '/manage/events',
	},
	{
		authLevel: [UserType.Sponsor],
		component: SponsorHackerView,
		displayText: 'View Hackers',
		path: '/view/hackers',
	},
	{
		authLevel: [UserType.Organizer],
		component: SponsorPage,
		displayText: 'Manage Sponsors',
		path: '/manage/sponsors',
	},
	{
		authLevel: [UserType.Hacker, UserType.Sponsor, UserType.Organizer],
		component: Help,
		displayText: 'Help',
		path: '/help',
	},
	{
		authLevel: [UserType.Organizer, UserType.Sponsor],
		component: Nfc,
		displayText: 'Scan NFC',
		path: '/nfc',
	},
];

export default routes;
