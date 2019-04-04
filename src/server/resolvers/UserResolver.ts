import { Resolver, Query, Arg } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { User } from '../data/User';

import { userModel } from '../models/User';

// !!!!!!!!!!!!!!!!!!!!!
// main issue: https://github.com/typestack/class-transformer/issues/53
// !!!!!!!!!!!!!!!!!!!!!

@Resolver(of => User)
class UserResolver {
	/**
	 * @param {string} email - email address of a particular user
	 * @returns {User} A User with the provided email
	 */
	@Query(() => User, {
		description: 'Return a single User corresponding to a known email address',
		nullable: true,
	})
	public async getUserByEmail(@Arg('email') email: string): Promise<User | undefined> {
		const user = await userModel.findOne({ email });
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
	public async getAllUsers(): Promise<User[]> {
		const users = await userModel.find({});
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
