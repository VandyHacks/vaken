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
			email: 'ml@mattleon.com',
			firstName: 'Matthew',
			lastName: 'Leon',
			status: Status.Created,
			needsReimbursement: true,
		},
		{
			email: 'irfaan.khalid@vanderbilt.edu',
			firstName: 'Irfaan',
			lastName: 'Khalid',
			status: Status.Accepted,
			needsReimbursement: false,
		},
		{
			email: 'alan.wilms@vanderbilt.edu',
			firstName: 'Alan',
			lastName: 'Wilms',
			status: Status.Verified,
			needsReimbursement: true,
		},
		{
			email: 'felix.tiet@vanderbilt.edu',
			firstName: 'Felix',
			lastName: 'Tiet',
			status: Status.Rejected,
			needsReimbursement: false,
		},
	]);
};
