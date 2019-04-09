import { Resolver, Query, Arg, Mutation, Args } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { User } from '../data/User';
import { UserModel } from '../models/User';

@Resolver(() => User)
class UserResolver {
	/**
	 * @param {string} email - email address of a particular user
	 * @returns {User} A User with the provided email
	 */
	@Query(() => User, {
		description: 'Return a single User corresponding to a known email address',
		nullable: true,
	})
	public static async getUserByEmail(@Arg('email') email: string): Promise<User | undefined> {
		const user = await UserModel.findOne({ email });
		if (!user) {
			return undefined;
		}
		const userObject = user.toObject();
		delete userObject._id;
		delete userObject.__v;
		delete userObject.password;
		return plainToClass(User, userObject as User);
	}

	/**
	 * @returns {[User]} All Users in the Vaken database
	 */
	@Query(() => [User], { description: 'Return all Users in the database' })
	public static async getAllUsers(): Promise<User[]> {
		const users = await UserModel.find({});
		if (!users) {
			return [];
		}
		const userList: Record<string, any>[] = [];
		users.forEach(user => {
			const userObject = user.toObject();
			delete userObject._id;
			delete userObject.__v;
			delete userObject.password;
			userList.push(userObject);
		});
		return plainToClass(User, userList);
	}

	/**
	 * @param {string} email - The email address of the user to update
	 * @param {User} user - Replacement User object with updated fields
	 * @returns {Promise<User | null>} New and updated User or null
	 */
	@Mutation(() => User, {
		description: "Update a Hacker's status and return updated status",
	})
	public static async updateUser(
		@Arg('email', { nullable: false }) email: string,
		@Args() user: User
	): Promise<User | null> {
		// Identify user by email, update all fields, and save new updatedUser object
		const updatedUser = await UserModel.findOneAndUpdate(
			{ email },
			{
				$set: {
					authLevel: user.authLevel,
					authType: user.authType,
					dietaryRestrictions: user.dietaryRestrictions,
					firstName: user.firstName,
					gender: user.gender,
					githubId: user.githubId,
					googleId: user.googleId,
					lastName: user.lastName,
					nfcCodes: user.nfcCodes,
					phoneNumber: user.phoneNumber,
					shirtSize: user.shirtSize,
				},
			},
			{ new: true }
		);

		// Return the new User or null if the user wasn't found and updated
		return updatedUser ? plainToClass(User, updatedUser as User) : null;
	}
}

export default UserResolver;

// Copyright (c) 2019 Vanderbilt University
