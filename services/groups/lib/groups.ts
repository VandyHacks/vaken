import { MongoDataSource } from 'apollo-datasource-mongodb';
import { ObjectId, Filter } from 'mongodb';
import { GroupDbObject, Group, Role, IdType } from './generated.graphql';
import { notEmpty, valueOf } from '../../../common/util/predicates';
import { getUser } from './query/groups_query';

export function groupDbOjectToDomainConverter(dbObject?: GroupDbObject | null): Group | null {
	return dbObject
		? {
				...dbObject,
				id: dbObject._id.toHexString(),
				members: dbObject.members?.map(oid => ({ __typename: 'User', id: oid.toHexString() })),
				createdAt: dbObject.createdAt?.getTime(),
				roles: dbObject.roles?.filter(valueOf(Role)),
				antiRoles: dbObject.antiRoles?.filter(valueOf(Role)),
		  }
		: null;
}

export class Groups extends MongoDataSource<GroupDbObject> {
	async getGroup(id: string): Promise<Group | null> {
		const groupDbObject = await this.findOneById(new ObjectId(id));
		return groupDbOjectToDomainConverter(groupDbObject);
	}

	async getGroups(args: { first: number; after?: string | null }): Promise<Group[]> {
		const filter: Filter<GroupDbObject> = args.after
			? { _id: { $gt: new ObjectId(args.after) } }
			: {};
		return (await this.collection.find(filter).limit(args.first).toArray())
			.map(groupDbOjectToDomainConverter)
			.filter(notEmpty);
	}

	async getGroupsForUser(userId: string): Promise<Group[] | null> {
		const groupDbObjects = await this.findByFields({ members: [new ObjectId(userId)] });
		return groupDbObjects.map(groupDbOjectToDomainConverter).filter(notEmpty);
	}

	async removeUserFromGroup(args: {
		userId: string;
		groupId: string;
		userIdType: IdType;
	}): Promise<Group | null> {
		const userId = (await getUser(args))?.id;
		const updateResult = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(args.groupId) },
			{ $pull: { members: new ObjectId(userId) } },
			{ upsert: false, returnDocument: 'after' }
		);
		return groupDbOjectToDomainConverter(updateResult.value);
	}

	async addUserToGroup(args: {
		userId: string;
		groupId: string;
		userIdType: IdType;
	}): Promise<Group | null> {
		const userId = (await getUser(args))?.id;
		const updateResult = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(args.groupId) },
			{ $addToSet: { members: new ObjectId(userId) } },
			{ returnDocument: 'after' }
		);
		return groupDbOjectToDomainConverter(updateResult.value);
	}

	async createGroup(args: { name: string }): Promise<Group> {
		const { name } = args;
		const createdAt = new Date();
		const group = await this.collection.insertOne({ _id: new ObjectId(), name, createdAt });
		return { id: group.insertedId.toHexString(), name, createdAt: createdAt.getTime() };
	}

	async setGroupRoles(args: {
		groupId: string;
		roles?: Role[] | null;
		antiRoles?: Role[] | null;
	}): Promise<Group | null> {
		const { groupId, roles, antiRoles } = args;
		const result = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(groupId) },
			{ roles, antiRoles },
			{ upsert: false, returnDocument: 'after' }
		);
		return groupDbOjectToDomainConverter(result.value);
	}
}
