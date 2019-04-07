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
];

export const addHackers = () =>
	hackers.forEach(hacker => {
		fetch('/api/register/hacker', {
			body: JSON.stringify({ ...hacker, password: 'test123' }),
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		}).then(res => console.log(res.json));
	});

addHackers();
export default addHackers;
