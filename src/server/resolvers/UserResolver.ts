import { Resolver, Query, Arg } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { User } from '../data/User';

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
		return await this.users.find(user => user.email === email);
	}

	/**
	 * Get all Users
	 */
	@Query(returns => [User], { description: 'Get all the Users in the database' })
	async getAllUsers(): Promise<User[]> {
		return await this.users;
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
