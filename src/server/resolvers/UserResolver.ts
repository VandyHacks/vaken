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
	 * Updates a user. If a field isn't provided in the GQL mutation, then
	 * it's considered undefined.
	 *
	 * @param {string} email - The email address of the user to update
	 * @param {User} args - The fields to update and their new values
	 * @param {User} lastName - The fields to update and their new values
	 * @returns {Promise<User>} Updated user
	 */
	@Mutation(() => Boolean, {
		description: 'Update a User',
	})
	public static async updateUser(
		@Arg('email') email: string,
		@Arg('authLevel', { nullable: true }) authLevel: AuthLevel,
		@Arg('dietaryRestrictions', { nullable: true }) dietaryRestrictions: string,
		@Arg('firstName', { nullable: true }) firstName: string,
		@Arg('gender', { nullable: true }) gender: Gender,
		@Arg('githubId', { nullable: true }) githubId: string,
		@Arg('googleId', { nullable: true }) googleId: string,
		@Arg('lastName', { nullable: true }) lastName: string,
		@Arg('newNfcCode', { nullable: true }) newNfcCode: string,
		@Arg('phoneNumber', { nullable: true }) phoneNumber: string,
		@Arg('shirtSize', { nullable: true }) shirtSize: ShirtSize
	): Promise<boolean> {
		// Find the user to update
		let user = await UserModel.findOne({ email });

		// Throw an error if no user exists with the provided email address
		if (!user) {
			throw new Error('User does not exist!');
		}

		// Try to update the appropriate fields for the desired user
		try {
			if (newNfcCode !== undefined) {
				await UserModel.updateOne({ email }, { $push: { nfcCodes: newNfcCode } });
			}

			console.log(dietaryRestrictions);

			await UserModel.updateOne(
				{ email },
				{
					$set: {
						authLevel: authLevel !== undefined ? authLevel : user.authLevel,
						dietaryRestrictions:
							dietaryRestrictions !== undefined ? dietaryRestrictions : user.dietaryRestrictions,
						firstName: firstName !== undefined ? firstName : user.firstName,
						gender: gender !== undefined ? gender : user.gender,
						githubId: githubId !== undefined ? githubId : user.githubId,
						googleId: googleId !== undefined ? googleId : user.googleId,
						lastName: lastName !== undefined ? lastName : user.lastName,
						phoneNumber: phoneNumber !== undefined ? phoneNumber : user.phoneNumber,
						shirtSize: shirtSize !== undefined ? shirtSize : user.shirtSize,
					},
				},
				{ new: true } // TODO - remove this?
			);
		} catch (err) {
			throw new Error('User could not be updated!');
		}

		return true;

		// Return the updated user
		// delete newUser._id;
		// delete newUser.__v;
		// delete newUser.password;
		// return plainToClass(User, newUser as User);
	}
}

export default UserResolver;

// Copyright (c) 2019 Vanderbilt University
