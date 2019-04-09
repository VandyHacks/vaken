import institutions from '../assets/data/institutions.json';
import names from '../assets/data/names.json';

const hackers = [
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

const getRandom = (max: number) => {
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

export const addHackers = (die: boolean) => {
	if (die) {
		for (let i = 0; i < 5000; i += 1) {
			const fn = names[getRandom(21000)];
			const ln = names[getRandom(21000)];
			const bool = !!getRandom(2);
			fetch('/api/register/UNSAFE', {
				body: JSON.stringify({
					email: `${fn}.${ln}@gmail.com`,
					firstName: fn,
					gradYear: getRandom(4) + 2019,
					lastName: ln,
					needsReimbursement: bool,
					password: 'P@ssword1',
					school: institutions[getRandom(1430)],
					status: statuses[getRandom(7)],
				}),
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
			});
		}
	}

	hackers.forEach(hacker =>
		fetch('/api/register/UNSAFE', {
			body: JSON.stringify({ ...hacker, password: 'p@ssword1' }),
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		}).then(res => console.log(res.json))
	);
};

export default addHackers;
