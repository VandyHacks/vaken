import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import Hacker from '../data/Hacker';
import HackerGenders from '../data/HackerGenders';
import HackerShirtSizes from '../data/HackerShirtSizes';
import HackerStatuses from '../data/HackerStatuses';
import { HackerModel } from '../models/Hacker';
import { User, UserModel } from '../models/User';
import AuthLevel from '../enums/AuthLevel';
import Status from '../enums/Status';

@Resolver(() => Hacker)
class HackerResolver {
	/**
	 * @param {string} email - a Hacker's email address
	 * @returns {Hacker} a Hacker associated with the provided email address or null if not found
	 */
	@Query(() => Hacker, { nullable: true })
	public static async getHackerByEmail(@Arg('email') email: string): Promise<Hacker | null> {
		const user = await UserModel.findOne({ email, authLevel: AuthLevel.HACKER });
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

		console.log(hackers);
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
	 * @param {string} email - email address of a particular user
	 * @param {Status} newStatus - new status to assign to user
	 * @returns {Status} new status of user or null if the hacker doesn't exist
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
