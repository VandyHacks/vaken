import { Resolver, Query, Arg } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { Hacker } from '../data/Hacker';
import { Status } from '../enums/Status';

@Resolver(of => Hacker)
export class HackerResolver {
	private readonly hackers: Hacker[] = createHackerSamples();

	/**
	 * Returns a Hacker corresponding a an email address (unique)
	 */
	@Query(returns => Hacker, { nullable: true })
	async getHackerByEmail(@Arg('email') email: string): Promise<Hacker | undefined> {
		return await this.hackers.find(hackers => hackers.email === email);
	}

	/**
	 * Get all Hackers
	 */
	@Query(returns => [Hacker], {
		description: 'Get all the Hackers and associated data in the database',
	})
	async getAllHackers(): Promise<Hacker[]> {
		return await this.hackers;
	}
}

/**
 * Function to create dummy data
 */
let createHackerSamples = () => {
	return plainToClass(Hacker, [
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
			status: Status.Created,
		},
		{
			firstName: 'John',
			lastName: 'Smith',
			email: 'j.p.smith@vanderbilt.edu',
			gradYear: 2019,
			school: 'Vanderbilt University',
			status: Status.Verified,
			needsReimbursement: true

		},
		{
			firstName: 'Courtney',
			lastName: 'Johnson',
			email: 'c.johnson@vanderbilt.edu',
			gradYear: 2022,
			school: 'Vanderbilt University',
			status: Status.Started,
			needsReimbursement: true
		},
		{
			firstName: 'Jeremy',
			lastName: 'Xu',
			email: 'j.xu@vanderbilt.edu',
			gradYear: 2020,
			school: 'Vanderbilt University',
			status: Status.Rejected,
			needsReimbursement: false,
		},
		{
			firstName: 'Abigail',
			lastName: 'Teer',
			email: 'teera@utk.edu',
			gradYear: 2019,
			school: 'University of Tennessee',
			status: Status.Submitted,
			needsReimbursement: true,
		},
		{
			firstName: 'Howard',
			lastName: 'Young',
			email: 'howardyoung@crimson.ua.edu',
			gradYear: 2021,
			school: 'University of Alabama',
			status: Status.Accepted,
			needsReimbursement: true,
		},
		{
			firstName: 'Shelby',
			lastName: 'Zhang',
			email: 's.zhang@vanderbilt.edu',
			gradYear: 2022,
			school: 'Vanderbilt University',
			status: Status.Confirmed,
			needsReimbursement: true,
		},
	]);
};
