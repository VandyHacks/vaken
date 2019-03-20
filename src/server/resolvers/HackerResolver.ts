import { Resolver, Query, Arg } from 'type-graphql';
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
				needsReimbursement: hacker.needReimbursement,
				school: hacker.school,
				gradYear: hacker.gradYear,
				// status: hacker.status,
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
					needsReimbursement: hacker.needReimbursement,
					school: hacker.school,
					gradYear: hacker.gradYear,
					// status: hacker.status,
					authType: hacker.authType,
					authLevel: hacker.authLevel,
				};
				hackerList.push(temp);
			});
			return plainToClass(Hacker, hackerList);
		}
		// return await this.hackers;
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
		// {
		// 	name: 'Courtney Johnson',
		// 	email: 'c.johnson@vanderbilt.edu',
		// 	gradYear: 2022,
		// 	school: 'Vanderbilt University',
		// 	status: 'verified',
		// 	requiresTravelReimbursement: true,
		// },
		// {
		// 	name: 'Jeremy Xu',
		// 	email: 'j.xu@vanderbilt.edu',
		// 	gradYear: 2020,
		// 	school: 'Vanderbilt University',
		// 	status: 'rejected',
		// 	requiresTravelReimbursement: false,
		// },
		// {
		// 	name: 'Abigail Teer',
		// 	email: 'teera@utk.edu',
		// 	gradYear: 2019,
		// 	school: 'University of Tennessee',
		// 	status: 'submitted',
		// 	requiresTravelReimbursement: true,
		// },
		// {
		// 	name: 'Howard Young',
		// 	email: 'howardyoung@crimson.ua.edu.edu',
		// 	gradYear: 2021,
		// 	school: 'University of Alabama',
		// 	status: 'accepted',
		// 	requiresTravelReimbursement: true,
		// },
		// {
		// 	name: 'Shelby Zhang',
		// 	email: 's.zhang@vanderbilt.edu',
		// 	gradYear: 2022,
		// 	school: 'Vanderbilt University',
		// 	status: 2,
		// 	requiresTravelReimbursement: true,
		// },
	]);
};
