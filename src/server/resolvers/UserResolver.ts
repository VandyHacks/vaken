import { Resolver, Query, Arg, Mutation, Args } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { User } from '../data/User';
import { UserModel } from '../models/User';
import UpdateUserInput from '../inputs/UpdateUserInput';
import AuthLevel from '../enums/AuthLevel';
import Gender from '../enums/Gender';
import ShirtSize from '../enums/ShirtSize';

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
	 * Updates a user.
	 *
	 * @param {string} email - The email address of the user to update
	 * @param {UpdateUserInput} data - Data to update the provided user
	 * @throws an error if any of the Mongo calls fail
	 * @returns {Promise<boolean>} true if successful
	 *
	 */
	@Mutation(() => Boolean, {
		description: 'Update a User',
	})
	public static async updateUser(
		@Arg('email') email: string,
		@Arg('data', { nullable: true }) data: UpdateUserInput
	): Promise<boolean> {
		// Find the user to update
		let user = await UserModel.findOne({ email });

		// Throw an error if no user exists with the provided email address
		if (!user) {
			throw new Error('User does not exist!');
		}

		/*
		 * Try to update the appropriate fields for the desired user

		 * All the nullable & optional mutation args are considered undefined if not provided
		 * in the GQL mutation. Unfortunately, we have to write an if-statement for every
		 * field.
		 */
		try {
			// Update authLevel
			if (data.authLevel !== undefined) {
				await UserModel.updateOne({ email }, { $set: { authLevel: data.authLevel } });
			}

			// Update dietaryRestrictions
			if (data.dietaryRestrictions !== undefined) {
				await UserModel.updateOne(
					{ email },
					{ $set: { dietaryRestrictions: data.dietaryRestrictions } }
				);
			}

			// Update firstName
			if (data.firstName !== undefined) {
				await UserModel.updateOne({ email }, { $set: { firstName: data.firstName } });
			}

			// Update gender
			if (data.gender !== undefined) {
				await UserModel.updateOne({ email }, { $set: { gender: data.gender } });
			}

			// Update githubId
			if (data.githubId !== undefined) {
				await UserModel.updateOne({ email }, { $set: { githubId: data.githubId } });
			}

			// Update googleId
			if (data.googleId !== undefined) {
				await UserModel.updateOne({ email }, { $set: { googleId: data.googleId } });
			}

			// Update lastName
			if (data.lastName !== undefined) {
				await UserModel.updateOne({ email }, { $set: { lastName: data.lastName } });
			}

			// Update nfcCodes (note that this is an array and we push just one new value)
			if (data.newNfcCode !== undefined) {
				await UserModel.updateOne({ email }, { $push: { nfcCodes: data.newNfcCode } });
			}

			// Update phoneNumber
			if (data.phoneNumber !== undefined) {
				await UserModel.updateOne({ email }, { $set: { phoneNumber: data.phoneNumber } });
			}

			// Update shirtSize
			if (data.shirtSize !== undefined) {
				await UserModel.updateOne({ email }, { $set: { shirtSize: data.shirtSize } });
			}
		} catch (err) {
			throw new Error('User could not be updated!');
		}

		// If successful, return true
		return true;
	}
}

export default UserResolver;

// Copyright (c) 2019 Vanderbilt University
