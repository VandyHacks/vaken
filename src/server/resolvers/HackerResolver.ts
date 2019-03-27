import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { Hacker } from '../data/Hacker';
import Status from '../enums/Status';
import { hackerModel } from '../models/Hacker';

@Resolver(() => Hacker)
class HackerResolver {
	/**
	 * @param {string} email - a Hacker's email address
	 * @returns {Hacker} a Hacker associated with the provided email address or null if not found
	 */
	@Query(() => Hacker, { nullable: true })
	public async getHackerByEmail(@Arg('email') email: string): Promise<Hacker | null> {
		const hacker = await hackerModel.findOne({ email: email });
		if (!hacker) {
			return null;
		} else {
			return plainToClass(Hacker, {
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
			});
		}
	}

	/**
	 * @returns {[Hacker]} - All Hackers in the database
	 */
	@Query(() => [Hacker], {
		description: 'Return all the Hackers in the database',
	})
	public async getAllHackers(): Promise<Hacker[]> {
		const hackers = await hackerModel.find({});

		if (!hackers) {
			return [];
		} else {
			let hackerList: Object[] = [];
			hackers.forEach(hacker => {
				hackerList.push({
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
				});
			});

			return plainToClass(Hacker, hackerList);
		}
	}

	/**
	 * @param {string} email - email address of a particular user
	 * @param {Status} newStatus - new status to assign to user
	 * @returns {Status} new status of user or null if the hacker doesn't exist
	 */
	@Mutation(() => Status, {
		description: "Update a Hacker's status and return updated status",
	})
	public async updateHackerStatus(
		@Arg('email', { nullable: false }) email: string,
		@Arg('newStatus') newStatus: Status
	) {
		const newHacker = await hackerModel.findOneAndUpdate(
			{ email: email },
			{ $set: { status: newStatus } },
			{ new: true }
		);

		if (!newHacker) {
			return null;
		} else {
			return newHacker.status;
		}
	}
}

export default HackerResolver;
