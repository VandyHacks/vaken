import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import Hacker from '../data/Hacker';
import HackerGenders from '../data/HackerGenders';
import HackerShirtSizes from '../data/HackerShirtSizes';
import HackerStatuses from '../data/HackerStatuses';
import SchoolCounts from '../data/SchoolCounts';
import { HackerModel } from '../models/Hacker';
import { User, UserModel } from '../models/User';
import AuthLevel from '../enums/AuthLevel';
import Status from '../enums/Status';
import UpdateHackerInput from '../inputs/UpdateHackerInput';
import { teamModel } from '../models/Team';
import CONSTANTS from '../../common/constants.json';

@Resolver(() => Hacker)
class HackerResolver {
	/**
	 * @param {string} email - a Hacker's email address
	 * @returns {Promise<Hacker | null>} a Hacker associated with the provided email address
	 * 																	 or null if not found
	 */
	@Query(() => Hacker, { nullable: true })
	public static async getHackerByEmail(@Arg('email') email: string): Promise<Hacker | null> {
		const user = await UserModel.findOne({ authLevel: AuthLevel.HACKER, email });
		if (!user) {
			return null;
		}

		const hacker = await HackerModel.findOne({ user: user._id });
		if (!hacker) {
			return null;
		}

		const hackerObject = { ...hacker.toObject(), ...user.toObject() };
		delete hackerObject._id;
		delete hackerObject.__v;
		delete hackerObject.user;
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
		const users = await UserModel.find({ authLevel: AuthLevel.HACKER });
		if (!users) {
			return [];
		}

		const hackerList: Promise<Hacker | null>[] = [];
		users.forEach(user => {
			hackerList.push(
				HackerModel.findOne({ user: user._id }).then(hacker => {
					if (hacker) {
						const hackerObject = { ...hacker.toObject(), ...user.toObject() };
						delete hackerObject._id;
						delete hackerObject.__v;
						delete hackerObject.user;
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

	@Query(() => HackerGenders, {
		description: 'Returns count of hackers for each gender',
	})
	public static async getAllHackerGenders(): Promise<HackerGenders> {
		// Maybe query UserModel instead?
		const hackerList = await HackerModel.find({}).populate('user');

		const genderData = new HackerGenders();
		hackerList.forEach(hacker => {
			const user = hacker.user as User;
			if (user.gender) {
				genderData[user.gender] += 1;
			} else {
				genderData.UNKNOWN += 1;
			}
		});

		return plainToClass(HackerGenders, genderData);
	}

	@Query(() => HackerShirtSizes, {
		description: 'Returns count of hackers for each shirt shize',
	})
	public static async getAllHackerSizes(): Promise<HackerShirtSizes> {
		// Maybe query UserModel instead?
		const hackerList = await HackerModel.find({}).populate('user');

		const sizeData = new HackerShirtSizes();
		hackerList.forEach(hacker => {
			const user = hacker.user as User;
			if (user.shirtSize) {
				sizeData[user.shirtSize] += 1;
			} else {
				sizeData.UNKNOWN += 1;
			}
		});

		return plainToClass(HackerShirtSizes, sizeData);
	}

	@Query(() => HackerStatuses, {
		description: 'Returns count of hackers at each status',
	})
	public static async getAllHackerStatuses(): Promise<HackerStatuses> {
		// Maybe check for AuthLevel?
		const hackerList = await HackerModel.find({});

		const statusData = new HackerStatuses();
		hackerList.forEach(hacker => {
			statusData[hacker.status] += 1;
		});

		return plainToClass(HackerStatuses, statusData);
	}

	/**
	 * @param {number} number - number of top schools to return
	 * @returns {Promise<SchoolCounts[]>} an array of SchoolCounts objects
	 */
	@Query(() => [SchoolCounts], {
		description: 'Returns top schools with counts',
	})
	public static async getTopHackerSchools(
		@Arg('number', { nullable: false }) number: number
	): Promise<SchoolCounts[]> {
		const hackerList = await HackerModel.find({});

		const schoolData: any = {};
		hackerList.forEach(hacker => {
			if (hacker.school) {
				if (schoolData[hacker.school]) {
					schoolData[hacker.school] += 1;
				} else {
					schoolData[hacker.school] = 1;
				}
			}
		});

		const schoolList: SchoolCounts[] = [];
		Object.keys(schoolData).forEach(key => {
			const schoolCount = new SchoolCounts();
			schoolCount.school = key;
			schoolCount.counts = schoolData[key];
			schoolList.push(schoolCount);
		});

		// Move the largest counts to the beginning of the list
		schoolList.sort((a, b) => (a.counts < b.counts ? 1 : -1));

		return plainToClass(SchoolCounts, schoolList.slice(0, number));
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
		const user = await UserModel.findOne({ authLevel: AuthLevel.HACKER, email });

		// Throw an error if no such user exists
		if (!user) {
			throw new Error('User does not exist!');
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
				await HackerModel.updateOne({ user: user._id }, { $set: { status: data.status } });
			}

			// Update school
			if (data.school !== undefined) {
				await HackerModel.updateOne({ user: user._id }, { $set: { school: data.school } });
			}

			// Update gradYear
			if (data.gradYear !== undefined) {
				await HackerModel.updateOne({ user: user._id }, { $set: { gradYear: data.gradYear } });
			}

			// Update ethnicity
			if (data.ethnicity !== undefined) {
				await HackerModel.updateOne({ user: user._id }, { $set: { ethnicity: data.ethnicity } });
			}

			// Update race (this is an array)
			if (data.race !== undefined) {
				await HackerModel.updateOne({ user: user._id }, { $set: { race: data.race } });
			}

			// Update majors (note that this is an array)
			if (data.majors !== undefined) {
				await HackerModel.updateOne({ user: user._id }, { $set: { majors: data.majors } });
			}

			// Update adult
			if (data.adult !== undefined) {
				await HackerModel.updateOne({ user: user._id }, { $set: { adult: data.adult } });
			}

			// Update firstHackathon
			if (data.firstHackathon !== undefined) {
				await HackerModel.updateOne(
					{ user: user._id },
					{ $set: { firstHackathon: data.firstHackathon } }
				);
			}

			// Update volunteer
			if (data.volunteer !== undefined) {
				await HackerModel.updateOne({ user: user._id }, { $set: { volunteer: data.volunteer } });
			}

			// Update github
			if (data.github !== undefined) {
				await HackerModel.updateOne({ user: user._id }, { $set: { github: data.github } });
			}

			// Update linkedin
			if (data.linkedin !== undefined) {
				await HackerModel.updateOne({ user: user._id }, { $set: { linkedin: data.linkedin } });
			}

			// Update devpost
			if (data.devpost !== undefined) {
				await HackerModel.updateOne({ user: user._id }, { $set: { devpost: data.devpost } });
			}

			// Update website
			if (data.website !== undefined) {
				await HackerModel.updateOne({ user: user._id }, { $set: { website: data.website } });
			}

			// Update essays (note this is an array)
			if (data.essays !== undefined) {
				await HackerModel.updateOne({ user: user._id }, { $set: { essays: data.essays } });
			}

			// Update codeOfConduct
			if (data.codeOfConduct !== undefined) {
				await HackerModel.updateOne(
					{ user: user._id },
					{ $set: { codeOfConduct: data.codeOfConduct } }
				);
			}

			// Update needsReimbursement
			if (data.needsReimbursement !== undefined) {
				await HackerModel.updateOne(
					{ user: user._id },
					{ $set: { needsReimbursement: data.needsReimbursement } }
				);
			}

			// Update lightningTalk
			if (data.lightningTalk !== undefined) {
				await HackerModel.updateOne(
					{ user: user._id },
					{ $set: { lightningTalk: data.lightningTalk } }
				);
			}

			// Update teamCode
			if (data.teamCode !== undefined) {
				await HackerModel.updateOne({ user: user._id }, { $set: { teamCode: data.teamCode } });
			}

			// Update walkin
			if (data.walkin !== undefined) {
				await HackerModel.updateOne({ user: user._id }, { $set: { walkin: data.walkin } });
			}

			// Update teamName
			if (data.teamName !== undefined) {
				await HackerModel.updateOne({ user: user._id }, { $set: { teamName: data.teamName } });
			}
		} catch (err) {
			throw new Error('Hacker could not be updated!');
		}

		// If successful, return true
		return true;
	}

	/**
	 * @param {string} email - email address of a particular hacker
	 * @param {string} teamName - name of team to join
	 * @throws {err} if unsuccessful
	 * @returns {Status} true if successful
	 */
	@Mutation(() => Status, {
		description: "Update a Hacker's status and return updated status",
	})
	public static async joinTeam(
		@Arg('email', { nullable: false }) email: string,
		@Arg('teamName') teamName: string
	): Promise<boolean> {
		// Make sure the hacker and team exist
		const team = await teamModel.findOne({ teamName });
		const user = await UserModel.findOne({ authLevel: AuthLevel.HACKER, email });

		// If the hacker doesn't exist, throw an error
		if (!user) {
			throw new Error('User does not exist!');
		}

		// Ensure the team exists and the hacker can join
		if (!team) {
			try {
				await teamModel.create({ size: 1, teamMembers: [{ _id: user._id }], teamName });
			} catch (err) {
				throw new Error('Team could not be created!');
			}
		} else if (team.teamMembers.indexOf(user._id) != -1) {
			throw new Error('Hacker is already a part of this team!');
		} else if (team.size === CONSTANTS.MAX_TEAM_SIZE) {
			throw new Error('This team is already full!');
		} else {
			// Add the hacker to the team
			try {
				await teamModel.updateOne(
					{ teamName },
					{ $push: { teamMembers: { _id: user._id } }, $set: { size: team.size + 1 } }
				);
			} catch (err) {
				throw new Error('Hacker could not be added to team!');
			}

			// Update the hacker's team
			try {
				await HackerModel.updateOne({ _id: user._id }, { $set: { teamName: teamName } });
			} catch (err) {
				throw new Error('Hacker team could not be updated!');
			}
		}

		// Upon success, return true
		return true;
	}

	/**
	 * @param {string} email - email address of the user to add to a team
	 * @returns {boolean} true if successful
	 * @throws {Error} if unsuccessful
	 */
	@Mutation(() => Boolean, {
		description: 'Leave a team',
	})
	public static async leaveTeam(
		@Arg('email', { nullable: false }) email: string
	): Promise<boolean> {
		// Ensure the team and hacker are in a valid state
		const user = await UserModel.findOne({ authLevel: AuthLevel.HACKER, email });

		// If the user doesn't exist, throw an error
		if (!user) {
			throw new Error('User does not exist!');
		}

		// Get the hacker's team name
		const hacker = await HackerModel.findOneAndUpdate({ user: user._id }, { new: true });

		if (!hacker) {
			throw new Error('Hacker does not exist!');
		}

		const team = await teamModel.findOne({ teamName: hacker.teamName });

		// If the team doesn't exist for some ungodly reason, just update the Hacker and throw an error
		if (!team) {
			await HackerModel.updateOne({ _id: user._id }, { $set: { teamName: '' } });
			throw new Error('Team does not exist!');
		}

		// Remove hacker from the team
		try {
			const updatedTeam = await teamModel.findOneAndUpdate(
				{ teamName: hacker.teamName },
				{ $pull: { teamMembers: user._id }, $set: { size: team.size - 1 } },
				{ new: true }
			);

			// Remove teamName from Hacker's profile
			await HackerModel.updateOne({ _id: user._id }, { $set: { teamName: '' } });

			// If the team is now empty, delete it
			if (updatedTeam && updatedTeam.size === 0) {
				try {
					// Doesn't currently work for some reason
					// We are able to reach this part of the code
					await teamModel.deleteOne({ teamname: hacker.teamName });
				} catch (err) {
					throw new Error('Now empty team could not be deleted!');
				}
			}
		} catch (err) {
			throw new Error('Hacker could not be removed from team!');
		}

		// Upon success, return true
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
		if (!Object.values(Status).includes(newStatus)) {
			throw new Error('Incorrect newStatus arg!');
		}

		const user = await UserModel.findOne({ authLevel: AuthLevel.HACKER, email });
		if (!user) {
			return null;
		}

		const newHacker = await HackerModel.findOneAndUpdate(
			{ user: user._id },
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
