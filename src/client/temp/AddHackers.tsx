const hackers = [
	{
		firstName: 'Matthew',
		lastName: 'Leon',
		email: 'ml@mattleon.com',
		gender: 'male',
		nfcCodes: [],
		phoneNumber: '+19876543210',
		shirtSize: 'M',
		needsReimbursement: false,
		school: 'Vanderbilt University',
		gradYear: 2021,
	},
	{
		firstName: 'John',
		lastName: 'Smith',
		email: 'j.p.smith@vanderbilt.edu',
		gradYear: 2019,
		school: 'Vanderbilt University',
		needsReimbursement: true,
	},
	{
		firstName: 'Courtney',
		lastName: 'Johnson',
		email: 'c.johnson@vanderbilt.edu',
		gradYear: 2022,
		school: 'Vanderbilt University',
		needsReimbursement: true,
	},
	{
		firstName: 'Jeremy',
		lastName: 'Xu',
		email: 'j.xu@vanderbilt.edu',
		gradYear: 2020,
		school: 'Vanderbilt University',
		needsReimbursement: false,
	},
	{
		firstName: 'Abigail',
		lastName: 'Teer',
		email: 'teera@utk.edu',
		gradYear: 2019,
		school: 'University of Tennessee',
		needsReimbursement: true,
	},
	{
		firstName: 'Howard',
		lastName: 'Young',
		email: 'howardyoung@crimson.ua.edu',
		gradYear: 2021,
		school: 'University of Alabama',
		needsReimbursement: true,
	},
	{
		firstName: 'Shelby',
		lastName: 'Zhang',
		email: 's.zhang@vanderbilt.edu',
		gradYear: 2022,
		school: 'Vanderbilt University',
		needsReimbursement: true,
	},
];

export const addHackers = () =>
	hackers.forEach(hacker => {
		fetch('/api/register/hacker', {
			body: JSON.stringify({ ...hacker, password: "test123" }),
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		}).then(res => console.log(res.json));
	});

addHackers();
export default addHackers;
