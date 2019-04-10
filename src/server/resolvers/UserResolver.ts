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
	 * @param {User} args - The fields to update and their new values
	 * @returns {Promise<User>} Updated user
	 */
	@Mutation(() => User, {
		description: "Update a Hacker's status and return updated status",
	})
	public static async updateUser(
		@Arg('email', { nullable: false }) email: string,
		@Args() args: User
	): Promise<User> {
		// Find the user to update
		const user = await UserModel.findOne({ email });

		// Throw an error if no user exists with the provided email address
		if (!user) {
			throw new Error('User does not exist!');
		}

		// Try to update the appropriate fields for the desired user
		try {
			// Update nfcCodes array first
			if (args.nfcCodes !== undefined) {
				await UserModel.updateOne({ email }, { $push: { nfcCodes: args.nfcCodes } });
			}

			// Update the rest of the fields
			await UserModel.updateOne(
				{ email },
				{
					$set: {
						authLevel: args.authLevel !== undefined ? args.authLevel : user.authLevel,
						dietaryRestrictions:
							args.dietaryRestrictions !== undefined
								? args.dietaryRestrictions
								: user.dietaryRestrictions,
						firstName: args.firstName !== undefined ? args.firstName : user.firstName,
						gender: args.gender !== undefined ? args.gender : user.gender,
						githubId: args.githubId !== undefined ? args.githubId : user.githubId,
						googleId: args.googleId !== undefined ? args.googleId : user.googleId,
						lastName: args.lastName !== undefined ? args.lastName : user.lastName,
						phoneNumber: args.phoneNumber !== undefined ? args.phoneNumber : user.phoneNumber,
						shirtSize: args.shirtSize !== undefined ? args.shirtSize : user.shirtSize,
					},
				}
			);
		} catch (err) {
			throw new Error('User could not be updated!');
		}

		// Return the updated user
		return plainToClass(User, user as User);
	}
}

export default UserResolver;

// Copyright (c) 2019 Vanderbilt University
