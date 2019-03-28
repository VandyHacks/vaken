import NotReady from '../routes/dashboard/NotReady';
import Application from '../routes/application/Application';
import HackerDash from '../routes/dashboard/HackerDash';
import ManageHackers from '../routes/manage/ManageHackers';
import OrganizerDash from '../routes/dashboard/LazyOrganizerDash';
import Team from '../routes/team/Team';

export const AuthLevel = {
	HACKER: 'hacker',
	ORGANIZER: 'organizer',
	SPONSOR: 'sponsor',
};

export const currentAuth = AuthLevel.ORGANIZER;

export const routes = [
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
		component: NotReady,
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
		displayText: 'Manage Sponsor',
		path: '/manageSponsor',
	},
	{
		authLevel: [AuthLevel.HACKER, AuthLevel.SPONSOR, AuthLevel.ORGANIZER],
		component: NotReady,
		displayText: 'Help',
		path: '/help',
	},
];

export default routes;
