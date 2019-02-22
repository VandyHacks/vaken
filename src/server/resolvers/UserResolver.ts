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
}

// let createUserSamples = () => {
// 	return plainToClass(User, [
// 		{
// 			description: 'Desc 1',
// 			title: 'User 1',
// 			ratings: [0, 3, 1],
// 			creationDate: new Date('2018-04-11'),
// 		},
// 		{
// 			description: 'Desc 2',
// 			title: 'User 2',
// 			ratings: [4, 2, 3, 1],
// 			creationDate: new Date('2018-04-15'),
// 		},
// 		{
// 			description: 'Desc 3',
// 			title: 'User 3',
// 			ratings: [5, 4],
// 			creationDate: new Date(),
// 		},
// 	]);
};
