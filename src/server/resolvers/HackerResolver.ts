import { Resolver, Query, Arg } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { Hacker } from '../data/Hacker';

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
	async getAllUsers(): Promise<Hacker[]> {
		return await this.hackers;
	}
}

/**
 * Function to create dummy data
 */
let createHackerSamples = () => {
	return plainToClass(Hacker, [
		{
			name: 'John Smith',
			email: 'j.p.smith@vanderbilt.edu',
			gradYear: 2019,
			school: 'Vanderbilt University',
			status: 4,
			requiresTravelReimbursement: true,
		},
		{
			name: 'Courtney Johnson',
			email: 'c.johnson@vanderbilt.edu',
			gradYear: 2022,
			school: 'Vanderbilt University',
			status: 2,
			requiresTravelReimbursement: true,
		},
		{
			name: 'Jeremy Xu',
			email: 'j.xu@vanderbilt.edu',
			gradYear: 2020,
			school: 'Vanderbilt University',
			status: 3,
			requiresTravelReimbursement: false,
		},
		{
			name: 'Abigail Teer',
			email: 'teera@utk.edu',
			gradYear: 2019,
			school: 'University of Tennessee',
			status: 1,
			requiresTravelReimbursement: true,
		},
		{
			name: 'Howard Young',
			email: 'howardyoung@crimson.ua.edu.edu',
			gradYear: 2021,
			school: 'University of Alabama',
			status: 3,
			requiresTravelReimbursement: true,
		},
		{
			name: 'Shelby Zhang',
			email: 's.zhang@vanderbilt.edu',
			gradYear: 2022,
			school: 'Vanderbilt University',
			status: 2,
			requiresTravelReimbursement: true,
		},
	]);
};
