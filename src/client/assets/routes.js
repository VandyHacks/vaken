export const AuthLevel = {
	HACKER: 'hacker',
	ORGANIZER: 'organizer',
	SPONSOR: 'sponsor',
};

export const routes = [
	{
		authLevel: [AuthLevel.HACKER, AuthLevel.SPONSOR, AuthLevel.ORGANIZER],
		displayText: 'Dashboard',
		path: '/dashboard/organizer',
	},
	{
		authLevel: [AuthLevel.HACKER, AuthLevel.SPONSOR, AuthLevel.ORGANIZER],
		displayText: 'Profile',
		path: '/profile',
	},
	{
		authLevel: [AuthLevel.HACKER],
		displayText: 'Application',
		path: '/application',
	},
	{
		authLevel: [AuthLevel.HACKER],
		displayText: 'Team',
		path: '/team',
	},
	{
		authLevel: [AuthLevel.HACKER, AuthLevel.SPONSOR, AuthLevel.ORGANIZER],
		displayText: 'Help',
		path: '/help',
	},
];

export default routes;
