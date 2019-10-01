import React from 'react';
import { NotReady } from '../routes/dashboard/NotReady';
import { Application } from '../routes/application/Application';
import { HackerDash } from '../routes/dashboard/HackerDash';
import { ManageHackers } from '../routes/manage/ManageHackers';
import { Team } from '../routes/team/Team';
import { Profile } from '../routes/profile/Profile';
import { Help } from '../routes/help/Help';
import { UserType } from '../generated/graphql';

const routes = [
	{
		authLevel: [UserType.Organizer],
		component: React.lazy(() => import('../routes/dashboard/OrganizerDash')),
		displayText: 'Dashboard',
		path: '/dashboard',
	},
	{
		authLevel: [UserType.Hacker, UserType.Sponsor],
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
		component: NotReady,
		displayText: 'Manage Sponsors',
		path: '/manage/sponsors',
	},
	{
		authLevel: [UserType.Hacker, UserType.Sponsor, UserType.Organizer],
		component: Help,
		displayText: 'Help',
		path: '/help',
	},
];

export default routes;
