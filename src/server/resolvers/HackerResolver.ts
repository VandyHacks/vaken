import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import Hacker from '../data/Hacker';
import { HackerModel } from '../models/Hacker';
import { HackerModel } from '../models/Hacker';
import AuthLevel from '../enums/AuthLevel';
import Status from '../enums/Status';
import UpdateHackerInput from '../inputs/UpdateHackerInput';

@Resolver(() => Hacker)
class HackerResolver {
	/**
	 * @param {string} email - a Hacker's email address
	 * @returns {Promise<Hacker | null>} a Hacker associated with the provided email address
	 * 																	 or null if not found
	 */
	@Query(() => Hacker, { nullable: true })
	public static async getHackerByEmail(@Arg('email') email: string): Promise<Hacker | null> {
		const hacker = await HackerModel.findOne({ authLevel: AuthLevel.HACKER, email });
		if (!hacker) {
			return null;
		}

		const hacker = await HackerModel.findOne({ hacker: hacker._id });
		if (!hacker) {
			return null;
		}

		const hackerObject = { ...hacker.toObject(), ...hacker.toObject() };
		delete hackerObject._id;
		delete hackerObject.__v;
		delete hackerObject.hacker;
		delete hackerObject.password;

		return plainToClass(Hacker, hackerObject as Hacker);
	}

	/**
	 * @returns {Promise<[Hacker]>} - All Hackers in the database
	 */
	@Query(() => [Hacker], {
		description: 'Return all the Hackers in the database',
	})
	public static async getAllHackers(): Promise<Hacker[]> {
		const users = await HackerModel.find({ authLevel: AuthLevel.HACKER });
		if (!users) {
			return [];
		}

		const hackerList: Promise<Hacker | null>[] = [];
		users.forEach(hacker => {
			hackerList.push(
				HackerModel.findOne({ hacker: hacker._id }).then(hacker => {
					if (hacker) {
						const hackerObject = { ...hacker.toObject(), ...hacker.toObject() };
						delete hackerObject._id;
						delete hackerObject.__v;
						delete hackerObject.hacker;
						delete hackerObject.password;
						return hackerObject;
					} else {
						return null;
					}
				})
			);
		});
		const hackers = await Promise.all(hackerList);
		hackers.filter(hacker => hacker);

		return plainToClass(Hacker, hackers);
	}

	/**
	 * Updates a Hacker.
	 *
	 * @param {string} email - The email address of the hacker to update
	 * @param {UpdateUserInput} data - Data to update the provided hacker (only desired fields)
	 * @throws an error if any of the Mongo calls fail
	 * @returns {Promise<boolean>} true if successful
	 *
	 */
	@Mutation(() => Boolean, {
		description: 'Update a Hacker',
	})
	public static async updateHacker(
		@Arg('email') email: string,
		@Arg('data', { nullable: true }) data: UpdateHackerInput
	): Promise<boolean> {
		// Find the hacker to update
		let hacker = await HackerModel.findOne({ email });

		// Throw an error if no hacker exists with the provided email address
		if (!hacker) {
			throw new Error('Hacker does not exist!');
		}

		/*
		 * Try to update the appropriate fields for the desired hacker

		 * All the nullable & optional mutation args are considered undefined if not provided
		 * in the GQL mutation. Unfortunately, we have to write an if-statement for every
		 * field.
		 */
		try {
			// Update status
			if (data.status !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { status: data.status } });
			}

			// Update school
			if (data.school !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { school: data.school } });
			}

			// Update gradYear
			if (data.gradYear !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { gradYear: data.gradYear } });
			}

			// Update ethnicity
			if (data.ethnicity !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { ethnicity: data.ethnicity } });
			}

			// Update race (this is an array)
			if (data.race !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { race: data.race } });
			}

			// Update majors (note that this is an array)
			if (data.majors !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { majors: data.majors } });
			}

			// Update adult
			if (data.adult !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { adult: data.adult } });
			}

			// Update firstHackathon
			if (data.firstHackathon !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { firstHackathon: data.firstHackathon } });
			}

			// Update volunteer
			if (data.volunteer !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { volunteer: data.volunteer } });
			}

			// Update github
			if (data.github !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { github: data.github } });
			}

			// Update linkedin
			if (data.linkedin !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { linkedin: data.linkedin } });
			}

			// Update devpost
			if (data.devpost !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { devpost: data.devpost } });
			}

			// Update website
			if (data.website !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { website: data.website } });
			}

			// Update essays (note this is an array)
			if (data.essays !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { essays: data.essays } });
			}

			// Update codeOfConduct
			if (data.codeOfConduct !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { codeOfConduct: data.codeOfConduct } });
			}

			// Update needsReimbursement
			if (data.needsReimbursement !== undefined) {
				await HackerModel.updateOne(
					{ email },
					{ $set: { needsReimbursement: data.needsReimbursement } }
				);
			}

			// Update lightningTalk
			if (data.lightningTalk !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { lightningTalk: data.lightningTalk } });
			}

			// Update teamCode
			if (data.teamCode !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { teamCode: data.teamCode } });
			}

			// Update walkin
			if (data.walkin !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { walkin: data.walkin } });
			}

			// Update teamName
			if (data.teamName !== undefined) {
				await HackerModel.updateOne({ email }, { $set: { teamName: data.teamName } });
			}
		} catch (err) {
			throw new Error('Hacker could not be updated!');
		}

		// If successful, return true
		return true;
	}

	/**
	 * @param {string} email - email address of a particular hacker
	 * @param {Status} newStatus - new status to assign to hacker
	 * @returns {Status} new status of hacker or null if the hacker doesn't exist
	 */
	@Mutation(() => Status, {
		description: "Update a Hacker's status and return updated status",
	})
	public static async updateHackerStatus(
		@Arg('email', { nullable: false }) email: string,
		@Arg('newStatus') newStatus: Status
	): Promise<Status | null> {
		const newHacker = await HackerModel.findOneAndUpdate(
			{ email },
			{ $set: { status: newStatus } },
			{ new: true }
		);

		if (!newHacker) {
			return null;
		}
		return newHacker.status;
	}
}

export default HackerResolver;

// Copyright (c) 2019 Vanderbilt University
