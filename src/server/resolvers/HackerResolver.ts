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
import { TeamModel } from '../models/Team';
import CONSTANTS from '../../common/constants.json';
import logger from '../logger';

@Resolver(() => Hacker)
class HackerResolver {
	/**
	 * @param {string} email - a Hacker's email address
	 * @returns {Promise<Hacker | null>} a Hacker associated with the provided email address
	 * 																	 or null if not found
	 */
	@Query(() => Hacker, { nullable: true })
	public static async hacker(@Arg('email') email: string): Promise<Hacker | null> {
		const hacker = await HackerModel.findOne({ email }).populate('user');
		if (!hacker) {
			return null;
		}
		const user = hacker.user as InstanceType<any>;

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
	public static async hackers(): Promise<Hacker[]> {
		const hackers = await HackerModel.find({}).populate('user');
		if (!hackers) {
			return [];
		}

		const hackerList: Promise<Hacker | null>[] = [];
		hackers.forEach(hacker => {
			const user = hacker.user as InstanceType<any>;
			const hackerObject = { ...hacker.toObject(), ...user.toObject() };
			delete hackerObject._id;
			delete hackerObject.__v;
			delete hackerObject.user;
			delete hackerObject.password;
			hackerList.push(hackerObject);
		});
		const hackerObjects = await Promise.all(hackerList);
		hackerObjects.filter(hacker => hacker);

		return plainToClass(Hacker, hackerObjects);
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
		// Filter out any undefined data
		const filteredData: UpdateHackerInput = {};
		Object.keys(data).forEach(key =>
			key !== undefined ? ((filteredData as any)[key] = (data as any)[key]) : ''
		);

		// Attempt to update the hacker
		try {
			const res = await HackerModel.updateOne({ email }, { $set: filteredData });
			if (res.nModified === 0) {
				logger.warn('Failed to update hacker');
				return false;
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
		if (!Object.values(Status).includes(newStatus)) {
			throw new Error('Incorrect newStatus arg!');
		}

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

	/**
	 * @param {string[]} emails - email addresses of users
	 * @param {Status} newStatus - new status to assign to user
	 * @returns {Status} new status of user or null if the hacker doesn't exist
	 */
	@Mutation(() => Status, {
		description: "Update one or more Hacker's status and return updated status",
	})
	public static async updateHackerStatusAsBatch(
		@Arg('emails', type => [String], { nullable: false }) emails: [string],
		@Arg('newStatus') newStatus: Status
	): Promise<Status | null> {
		emails.forEach(async email => {
			const newHacker = await HackerModel.findOneAndUpdate(
				{ email },
				{ $set: { status: newStatus } },
				{ new: true }
			);
			if (!newHacker) {
				return null;
			}
		});
		return newStatus;
	}

	/**
	 * @param {string} email - email address of a particular hacker
	 * @param {string} teamName - name of team to join
	 * @throws {Error} if unsuccessful
	 * @returns {Promise<boolean>} true if Hacker was able to join team
	 */
	@Mutation(() => Boolean, {
		description: 'Allow hackers to join a team',
	})
	public static async joinTeam(
		@Arg('email', { nullable: false }) email: string,
		@Arg('teamName', { nullable: false }) teamName: string
	): Promise<boolean> {
		// Make sure the team and hacker exist
		const team = await TeamModel.findOne({ teamName });
		const hacker = await HackerModel.findOne({ email });

		// Ensure the hacker object isn't null
		if (!hacker) {
			throw new Error('Hacker does not exist!');
		}

		// If the team doesn't exist, create it
		if (!team) {
			try {
				await TeamModel.create({ size: 1, teamMembers: [{ _id: hacker._id }], teamName });
			} catch (err) {
				throw new Error('Team could not be created!');
			}
		} else {
			// Check if the user is already part of the team
			if (team.teamMembers.indexOf(hacker._id) != -1) {
				throw new Error('Hacker is already a part of this team!');
			}

			// Check if the team is full
			if (team.size === CONSTANTS.MAX_TEAM_SIZE) {
				throw new Error('This team is already full!');
			}

			// Add the hacker to the team
			try {
				const res = await TeamModel.updateOne(
					{ teamName },
					{ $push: { teamMembers: { _id: hacker._id } }, $set: { size: team.size + 1 } }
				);
				if (res.nModified === 0) {
					logger.warn('Failed to add hacker to team');
					return false;
				}
			} catch (err) {
				throw new Error('Hacker could not be added to team!');
			}
		}

		// Update the hacker's team
		try {
			const res = await HackerModel.updateOne({ _id: hacker._id }, { $set: { teamName } });
			if (res.nModified === 0) {
				logger.warn('Failed to update hacker team');
				return false;
			}
		} catch (err) {
			throw new Error('Hacker team could not be updated!');
		}

		// Upon success, return true
		return true;
	}

	/**
	 * @param {string} email - email address of the user to add to a team
	 * @throws {Error} if unsuccessful
	 * @returns {Promise<boolean>} true if successful
	 */
	@Mutation(() => Boolean, {
		description: 'Allow hackers to leave a team',
	})
	public static async leaveTeam(
		@Arg('email', { nullable: false }) email: string
	): Promise<boolean> {
		// Ensure the team and hacker are in a valid state
		const hacker = await HackerModel.findOne({ email });

		if (!hacker) {
			throw new Error('Hacker does not exist!');
		} else if (!hacker.teamName) {
			throw new Error('Hacker is not on a team!');
		}

		const team = await TeamModel.findOne({ teamName: hacker.teamName });

		if (!team) {
			throw new Error('Team does not exist!');
		} else if (team.teamMembers.indexOf(hacker._id) === -1) {
			throw new Error('Hacker is not on this Team!');
		}

		// Remove hacker from the team
		try {
			const updatedTeam = await TeamModel.findOneAndUpdate(
				{ teamName: hacker.teamName },
				{ $pull: { teamMembers: hacker._id }, $set: { size: team.size - 1 } },
				{ new: true }
			);

			// Remove teamName from Hacker's profile
			const res = await HackerModel.updateOne({ _id: hacker._id }, { $unset: { teamName: '' } });
			if (res.nModified === 0) {
				logger.warn('Failed to remove team name');
				return false;
			}

			// If the team is now empty, delete it
			if (updatedTeam && updatedTeam.size === 0) {
				try {
					await TeamModel.deleteOne({ teamName: hacker.teamName });
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
}

export default HackerResolver;
