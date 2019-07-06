import { NotReady } from '../routes/dashboard/NotReady';
import { Application } from '../routes/application/Application';
import { HackerDash } from '../routes/dashboard/HackerDash';
import { ManageHackers } from '../routes/manage/ManageHackers';
import OrganizerDash from '../routes/dashboard/LazyOrganizerDash';
import { Team } from '../routes/team/Team';
import { Profile } from '../routes/profile/Profile';
import { Help } from '../routes/help/Help';

export const AuthLevel = {
	HACKER: 'Hacker',
	ORGANIZER: 'Organizer',
	SPONSOR: 'Sponsor',
};

export const currentAuth = AuthLevel.ORGANIZER;

const routes = [
	{
		authLevel: [AuthLevel.ORGANIZER],
		component: OrganizerDash,
		displayText: 'Dashboard',
		path: '/dashboard',
	},
	{
		authLevel: [AuthLevel.HACKER, AuthLevel.SPONSOR],
		component: HackerDash,
		displayText: 'Dashboard',
		path: '/dashboard',
	},
	{
		authLevel: [AuthLevel.HACKER, AuthLevel.SPONSOR, AuthLevel.ORGANIZER],
		component: Profile,
		displayText: 'Profile',
		path: '/profile',
	},
	{
		authLevel: [AuthLevel.HACKER],
		component: Application,
		displayText: 'Application',
		path: '/application',
	},
	{
		authLevel: [AuthLevel.HACKER],
		component: Team,
		displayText: 'Team',
		path: '/team',
	},
	{
		authLevel: [AuthLevel.ORGANIZER],
		component: ManageHackers,
		displayText: 'Manage Hackers',
		path: '/manageHackers',
	},
	{
		authLevel: [AuthLevel.ORGANIZER],
		component: NotReady,
		displayText: 'Manage Sponsors',
		path: '/manageSponsor',
	},
	{
		authLevel: [AuthLevel.HACKER, AuthLevel.SPONSOR, AuthLevel.ORGANIZER],
		component: Help,
		displayText: 'Help',
		path: '/help',
	},
];

export default routes;
