import { Resolver, Query, Arg, Mutation, Args } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { Hacker } from '../data/Hacker';
import { Status } from '../enums/Status';
import { hackerModel } from '../models/Hacker';

@Resolver(of => Hacker)
export class HackerResolver {
	private readonly hackers: Hacker[] = createHackerSamples();

	/**
	 * Returns a Hacker corresponding a an email address (unique)
	 */
	@Query(returns => Hacker, { nullable: true })
	async getHackerByEmail(@Arg('email') email: string): Promise<Hacker | undefined> {
		const hacker = await hackerModel.findOne({ email: email });
		if (!hacker) {
			console.log('No hacker found');
			return undefined;
		} else {
			const temp = {
				authLevel: hacker.authLevel,
				authType: hacker.authType,
				email: hacker.email,
				firstName: hacker.firstName,
				gender: hacker.gender,
				gradYear: hacker.gradYear,
				lastName: hacker.lastName,
				needsReimbursement: hacker.needsReimbursement,
				nfcCodes: hacker.nfcCodes,
				phoneNumber: hacker.phoneNumber,
				school: hacker.school,
				shirtSize: hacker.shirtSize,
				status: hacker.status,
			};
			return plainToClass(Hacker, temp);
		}
		// return await this.hackers.find(hackers => hackers.email === email);
	}

	/**
	 * Get all Hackers
	 */
	@Query(returns => [Hacker], {
		description: 'Get all the Hackers and associated data in the database',
	})
	async getAllHackers(): Promise<Hacker[]> {
		const hackers = await hackerModel.find({});
		if (!hackers) {
			console.log('No hackers found');
			return [];
		} else {
			let hackerList: Object[] = [];
			hackers.forEach(hacker => {
				let temp = {
					authLevel: hacker.authLevel,
					authType: hacker.authType,
					email: hacker.email,
					firstName: hacker.firstName,
					gender: hacker.gender,
					gradYear: hacker.gradYear,
					lastName: hacker.lastName,
					needsReimbursement: hacker.needsReimbursement,
					nfcCodes: hacker.nfcCodes,
					phoneNumber: hacker.phoneNumber,
					school: hacker.school,
					shirtSize: hacker.shirtSize,
					status: hacker.status,
				};
				hackerList.push(temp);
			});
			return plainToClass(Hacker, hackerList);
		}
		// return await this.hackers;
	}

	/**
	 * Update a hacker's status
	 */
	@Mutation((returns: any) => Status, {
		description: "Update a Hacker's status and return updated status",
	})
	async updateHackerStatus(
		@Arg('email', { nullable: false }) email: string,
		@Arg('newStatus') newStatus: Status
	) {
		const newHacker = await hackerModel.findOneAndUpdate(
			{ email: email },
			{ $set: { status: newStatus } },
			{ new: true }
		);
		if (!newHacker) {
			console.log('Error updating status');
			return null;
		} else {
			return newHacker.status;
		}
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
			gender: 'male',
			gradYear: 2021,
			lastName: 'Leon',
			needsReimbursement: false,
			nfcCodes: [],
			phoneNumber: '+19876543210',
			school: 'Vanderbilt University',
			shirtSize: 'M',
			status: Status.Created,
		},
		{
			email: 'j.p.smith@vanderbilt.edu',
			firstName: 'John',
			gradYear: 2019,
			lastName: 'Smith',
			needsReimbursement: true,
			school: 'Vanderbilt University',
			status: Status.Verified,
		},
		{
			email: 'c.johnson@vanderbilt.edu',
			firstName: 'Courtney',
			gradYear: 2022,
			lastName: 'Johnson',
			needsReimbursement: true,
			school: 'Vanderbilt University',
			status: Status.Started,
		},
		{
			email: 'j.xu@vanderbilt.edu',
			firstName: 'Jeremy',
			gradYear: 2020,
			lastName: 'Xu',
			needsReimbursement: false,
			school: 'Vanderbilt University',
			status: Status.Rejected,
		},
		{
			email: 'teera@utk.edu',
			firstName: 'Abigail',
			gradYear: 2019,
			lastName: 'Teer',
			needsReimbursement: true,
			school: 'University of Tennessee',
			status: Status.Submitted,
		},
		{
			email: 'howardyoung@crimson.ua.edu',
			firstName: 'Howard',
			gradYear: 2021,
			lastName: 'Young',
			needsReimbursement: true,
			school: 'University of Alabama',
			status: Status.Accepted,
		},
		{
			email: 's.zhang@vanderbilt.edu',
			firstName: 'Shelby',
			gradYear: 2022,
			lastName: 'Zhang',
			needsReimbursement: true,
			school: 'Vanderbilt University',
			status: Status.Confirmed,
		},
	]);
};
