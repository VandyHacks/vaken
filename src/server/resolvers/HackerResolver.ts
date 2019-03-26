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
				firstName: hacker.firstName,
				lastName: hacker.lastName,
				email: hacker.email,
				gender: hacker.gender,
				nfcCodes: hacker.nfcCodes,
				phoneNumber: hacker.phoneNumber,
				shirtSize: hacker.shirtSize,
				needsReimbursement: hacker.needsReimbursement,
				school: hacker.school,
				gradYear: hacker.gradYear,
				status: hacker.status,
				authType: hacker.authType,
				authLevel: hacker.authLevel,
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
					firstName: hacker.firstName,
					lastName: hacker.lastName,
					email: hacker.email,
					gender: hacker.gender,
					nfcCodes: hacker.nfcCodes,
					phoneNumber: hacker.phoneNumber,
					shirtSize: hacker.shirtSize,
					needsReimbursement: hacker.needsReimbursement,
					school: hacker.school,
					gradYear: hacker.gradYear,
					status: hacker.status,
					authType: hacker.authType,
					authLevel: hacker.authLevel,
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
			needsReimbursement: true,
		},
		{
			firstName: 'Courtney',
			lastName: 'Johnson',
			email: 'c.johnson@vanderbilt.edu',
			gradYear: 2022,
			school: 'Vanderbilt University',
			status: Status.Started,
			needsReimbursement: true,
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
