/* globals fetch */

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
		status: 'Submitted',
		teamName: '',
	},
	{
		email: 'j.p.smith@vanderbilt.edu',
		firstName: 'John',
		gradYear: 2019,
		lastName: 'Smith',
		needsReimbursement: true,
		school: 'Vanderbilt University',
		status: 'Created',
		teamName: '',
	},
	{
		email: 'c.johnson@vanderbilt.edu',
		firstName: 'Courtney',
		gradYear: 2022,
		lastName: 'Johnson',
		needsReimbursement: true,
		school: 'Vanderbilt University',
		status: 'Accepted',
		teamName: '',
	},
	{
		email: 'j.xu@vanderbilt.edu',
		firstName: 'Jeremy',
		gradYear: 2020,
		lastName: 'Xu',
		needsReimbursement: false,
		school: 'Vanderbilt University',
		status: 'Rejected',
		teamName: '',
	},
	{
		email: 'teera@utk.edu',
		firstName: 'Abigail',
		gradYear: 2019,
		lastName: 'Teer',
		needsReimbursement: true,
		school: 'University of Tennessee',
		status: 'Confirmed',
		teamName: '',
	},
	{
		email: 'howardyoung@crimson.ua.edu',
		firstName: 'Howard',
		gradYear: 2021,
		lastName: 'Young',
		needsReimbursement: true,
		school: 'University of Alabama',
		status: 'Submitted',
		teamName: '',
	},
	{
		email: 's.zhang@vanderbilt.edu',
		firstName: 'Shelby',
		gradYear: 2022,
		lastName: 'Zhang',
		needsReimbursement: true,
		school: 'Vanderbilt University',
		status: 'Started',
		teamName: '',
	},
];

const addHackers = (): void =>
	hackers.forEach(
		(hacker): void => {
			fetch('/api/register/hacker', {
				body: JSON.stringify({ ...hacker, password: 'test123' }),
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
			});
		}
	);

addHackers();

export default addHackers;
