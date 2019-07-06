import institutions from '../assets/data/institutions.json';
import names from '../assets/data/names.json';

export const hackers = [
	{
		email: 'ml@mattleon.com',
		firstName: 'Matthew',
		gender: 'male',
		gradYear: 2021,
		lastName: 'Leon',
		needsReimbursement: false,
		nfcCodes: [],
		phoneNumber: '+19876543210',
		school: 'Vanderbilt University',
		shirtSize: 'M',
		status: 'Confirmed',
	},
	{
		email: 'j.p.smith@vanderbilt.edu',
		firstName: 'John',
		gradYear: 2019,
		lastName: 'Smith',
		needsReimbursement: true,
		school: 'Vanderbilt University',
		status: 'Started',
	},
	{
		email: 'c.johnson@vanderbilt.edu',
		firstName: 'Courtney',
		gradYear: 2022,
		lastName: 'Johnson',
		needsReimbursement: true,
		school: 'Vanderbilt University',
		status: 'Created',
	},
	{
		email: 'j.xu@vanderbilt.edu',
		firstName: 'Jeremy',
		gradYear: 2020,
		lastName: 'Xu',
		needsReimbursement: false,
		school: 'Vanderbilt University',
		status: 'Submitted',
	},
	{
		email: 'teera@utk.edu',
		firstName: 'Abigail',
		gradYear: 2019,
		lastName: 'Teer',
		needsReimbursement: true,
		school: 'University of Tennessee',
		status: 'Submitted',
	},
	{
		email: 'howardyoung@crimson.ua.edu',
		firstName: 'Howard',
		gradYear: 2021,
		lastName: 'Young',
		needsReimbursement: true,
		school: 'University of Alabama',
		status: 'Rejected',
	},
	{
		email: 's.zhang@vanderbilt.edu',
		firstName: 'Shelby',
		gradYear: 2022,
		lastName: 'Zhang',
		needsReimbursement: true,
		school: 'Vanderbilt University',
		status: 'Submitted',
	},
	{
		authLevel: 'Organizer',
		email: 'org@vh.co',
		firstName: 'Vandy',
		gradYear: 2022,
		lastName: 'Hacks',
		needsReimbursement: false,
		school: 'Vanderbilt University',
		status: 'Confirmed',
	},
];

const getRandom = (max: number): number => {
	return Math.floor(Math.random() * max);
};
const statuses = [
	'Created',
	'Verified',
	'Started',
	'Submitted',
	'Accepted',
	'Confirmed',
	'Rejected',
];
const genders = ['Male', 'Female', 'Other', 'PreferNotToSay'];

const shirtSizes = ['UXS', 'US', 'UM', 'UL', 'UXL', 'UXXL', 'WS', 'WM', 'WL', 'WXL', 'WXXL'];

export const addHackers = async (die: boolean): Promise<void> => {
	const promises: Promise<Response>[] = [];
	if (die) {
		for (let i = 0; i < 1000; i += 1) {
			const fn = names[getRandom(21000)];
			const ln = names[getRandom(21000)];
			const bool = !!getRandom(2);
			const status = statuses[getRandom(7)];
			promises.push(
				fetch('/api/register/hacker', {
					body: JSON.stringify({
						firstName: fn,
						gender: genders[getRandom(7)],
						gradYear: getRandom(4) + 2019,
						lastName: ln,
						needsReimbursement: bool,
						password: 'P@ssword1',
						school: institutions[getRandom(1430)],
						shirtSize: shirtSizes[getRandom(11)],
						status,
						teamName: '',
						username: `${fn}.${ln}@gmail.com`,
					}),
					headers: {
						'Content-Type': 'application/json',
					},
					method: 'POST',
				})
			);
		}
	}

	hackers.forEach(hacker => {
		const { email, ...rest } = hacker;
		promises.push(
			fetch('/api/register/hacker', {
				body: JSON.stringify({ ...rest, password: 'p@ssword1', username: email }),
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
			})
		);
	});

	await Promise.all(promises);
};

export default addHackers;
