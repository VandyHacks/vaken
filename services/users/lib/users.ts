import { MongoDataSource } from 'apollo-datasource-mongodb';
import { ObjectId, Filter } from 'mongodb';
import { UserDbObject, User, UserFilter, Role } from './generated.graphql';
import { notEmpty, valueOf } from '../../../common/util/predicates';

export function userDbObjectToDomainConverter(userDbObject?: UserDbObject | null): User | null {
	return userDbObject
		? {
				...userDbObject,
				id: userDbObject._id.toHexString(),
				createdAt: userDbObject.createdAt?.getTime(),
				selfRoles: userDbObject.selfRoles?.filter(valueOf(Role)),
		  }
		: null;
}

export class Users extends MongoDataSource<UserDbObject> {
	private async lookupUsers(
		filterOrIds: Filter<UserDbObject> | string[],
		{ limit = 1 } = {}
	): Promise<User[]> {
		const filter =
			filterOrIds instanceof Array
				? { _id: { $in: filterOrIds.map(id => new ObjectId(id)) } }
				: filterOrIds;

		return (await this.collection.find(filter).limit(limit).toArray())
			.map(userDbObjectToDomainConverter)
			.filter(notEmpty);
	}

	async getUser(userId: string): Promise<User | null> {
		return (await this.lookupUsers([userId], { limit: 1 }))[0] ?? null;
	}

	async getUsers(args: {
		first: number;
		after?: string | null;
		filter: UserFilter;
	}): Promise<User[]> {
		const filter: Filter<UserDbObject> = args.after
			? { _id: { $gt: new ObjectId(args.after) } }
			: {};

		return this.lookupUsers(filter, { limit: args.first });
	}

	async getUsersByIds(userIds: string[]): Promise<User[]> {
		return this.lookupUsers(userIds, { limit: 1000 });
	}

	async logInUser(args: { email: string; provider: string; token: string }): Promise<User | null> {
		const result = await this.collection.findOneAndUpdate(
			{ email: args.email },
			{
				$setOnInsert: {
					email: args.email,
					selfRoles: [Role.Hacker],
					createdAt: new Date(),
					emailUnsubscribed: false,
				},
				$addToSet: { providers: { provider: args.provider, token: args.token } },
			},
			{ returnDocument: 'after', upsert: true }
		);
		return userDbObjectToDomainConverter(result.value);
	}
}
