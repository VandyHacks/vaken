import { Resolver, Query, Arg } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { User } from '../data/User';

import { userModel } from '../models/User';

// !!!!!!!!!!!!!!!!!!!!!
// main issue: https://github.com/typestack/class-transformer/issues/53
// !!!!!!!!!!!!!!!!!!!!!

/*
 * TODO - consider implementing ResolverInterface
 * TODO - implement mutations
 */
@Resolver(of => User)
export class UserResolver {
	private readonly users: User[] = createUserSamples();

	/**
	 * Returns a User corresponding a an email address (unique)
	 */
	@Query(returns => User, { nullable: true })
	async getUserByEmail(@Arg('email') email: string): Promise<User | undefined> {
		const user = await userModel.findOne({ email: email });
		if (!user) {
			console.log('No user found');
			return undefined;
		} else {
			// doesn't work
			// user.toObject();
			// delete user._id;
			// user.set('_id', undefined);

			// also doesn't work
			// let userCopy = user.toObject();
			// delete userCopy._id;
			// delete userCopy.__v;
			// userCopy.password = '';

			const temp = {
				authLevel: user.authLevel,
				authType: user.authType,
				email: user.email,
				gender: user.gender,
				nfcCodes: user.nfcCodes,
				shirtSize: user.shirtSize,
			};
			return plainToClass(User, temp);
		}
		// return await this.users.find(user => user.email === email);
	}

	/**
	 * Get all Users
	 */
	@Query(returns => [User], { description: 'Get all the Users in the database' })
	async getAllUsers(): Promise<User[]> {
		const users = await userModel.find({});
		if (!users) {
			console.log('No users found');
			return [];
		} else {
			let userList: Object[] = [];
			users.forEach(user => {
				let temp = {
					authLevel: user.authLevel,
					authType: user.authType,
					email: user.email,
					gender: user.gender,
					nfcCodes: user.nfcCodes,
					shirtSize: user.shirtSize,
				};
				userList.push(temp);
			});
			return plainToClass(User, userList);
		}
		// return await this.users;
	}
}

/**
 * Function to create dummy data
 */
let createUserSamples = () => {
	return plainToClass(User, [
		{
			email: 'ml@mattleon.com',
			firstName: 'Matthew',
			gender: 'male',
			lastName: 'Leon',
			nfcCodes: [],
			phoneNumber: '+19876543210',
			shirtSize: 'M',
		},
		{
			email: 'irfaan.khalid@vanderbilt.edu',
			firstName: 'Irfaan',
			gender: 'male',
			lastName: 'Khalid',
			nfcCodes: [],
			phoneNumber: '+18152809862',
			shirtSize: 'M',
		},
		{
			email: 'alan.wilms@vanderbilt.edu',
			firstName: 'Alan',
			gender: 'male',
			lastName: 'Wilms',
			nfcCodes: [],
			phoneNumber: '+19283403498',
			shirtSize: 'M',
		},
		{
			email: 'felix.tiet@vanderbilt.edu',
			firstName: 'Felix',
			gender: 'male',
			lastName: 'Tiet',
			nfcCodes: [],
			phoneNumber: '+18888888888',
			shirtSize: 'S',
		},
	]);
};
