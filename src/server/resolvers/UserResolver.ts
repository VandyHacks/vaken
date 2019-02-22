import {
	Resolver,
	Query,
	FieldResolver,
	Arg,
	Root,
	Mutation,
	Float,
	Int,
	ResolverInterface,
} from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { User } from '../data/User';

/*
 * TODO - add mutations
 */
@Resolver(of => User)
export class UserResolver implements ResolverInterface<User> {
	private readonly users: User[] = createUserSamples();

	@Query(returns => User, { nullable: true })
	async recipe(@Arg('nfcCodes') nfcCodes: String[]): Promise<User | undefined> {
		return await this.users.find(user => user.nfcCodes === nfcCodes);
	}
}

let createUserSamples = () => {
	return plainToClass(User, [
		{
			nfcCodes: [],
			firstName: 'Matthew',
			lastName: 'Leon',
			email: 'ml@mattleon.com',
			phoneNumber: '+19876543210',
			gender: 'male',
			shirtSize: 'M',
		},
		{
			nfcCodes: [],
			firstName: 'Irfaan',
			lastName: 'Khalid',
			email: 'irfaan.khalid@vanderbilt.edu',
			phoneNumber: '+18152809862',
			gender: 'male',
			shirtSize: 'M',
		},
		{
			nfcCodes: [],
			firstName: 'Alan',
			lastName: 'Wilms',
			email: 'alan.wilms@vanderbilt.edu',
			phoneNumber: '+19283403498',
			gender: 'male',
			shirtSize: 'M',
		},
		{
			nfcCodes: [],
			firstName: 'Felix',
			lastName: 'Tiet',
			email: 'felix.tiet@vanderbilt.edu',
			phoneNumber: '+18888888888',
			gender: 'male',
			shirtSize: 'S',
		},
	]);
};
