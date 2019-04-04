import { Resolver, Query, Arg } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { User } from '../data/User';

import { UserModel } from '../models/User';

// !!!!!!!!!!!!!!!!!!!!!
// main issue: https://github.com/typestack/class-transformer/issues/53
// !!!!!!!!!!!!!!!!!!!!!

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
		return plainToClass(User, {
			authLevel: user.authLevel,
			authType: user.authType,
			email: user.email,
			gender: user.gender,
			nfcCodes: user.nfcCodes,
			shirtSize: user.shirtSize,
		});
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
			userList.push({
				authLevel: user.authLevel,
				authType: user.authType,
				email: user.email,
				gender: user.gender,
				nfcCodes: user.nfcCodes,
				shirtSize: user.shirtSize,
			});
		});
		return plainToClass(User, userList);
	}
}

export default UserResolver;

// Copyright (c) 2019 Vanderbilt University
