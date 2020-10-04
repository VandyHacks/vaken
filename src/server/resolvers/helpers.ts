import { ApolloError, AuthenticationError, UserInputError } from 'apollo-server-express';
import { Collection, FilterQuery, ObjectID, ObjectId, MatchKeysAndValues } from 'mongodb';
import { UserDbInterface, UserInput, UserType } from '../generated/graphql';
import { Models } from '../models';
import logger from '../logger';

/**
 * Returns a copy of obj with all null fields removed.
 */
export function removeNulls<T>(obj: T): Partial<{ [K in keyof T]: NonNullable<T[K]> }> {
	return (
		(Object.keys(obj)
			// Filter out keys that lead to null values
			.filter(k => obj[k as keyof T] !== null) as (keyof T)[])
			// Reconstruct object with only non-null keys
			.reduce(
				(acc: Partial<{ [K in keyof T]: NonNullable<T[K]> }>, k: keyof T) => ({
					...acc,
					[k]: obj[k as keyof T],
				}),
				{}
			)
	);
}

/**
 * Higher-order function creating a verification function for an enum. When
 * used in the form `toEnum(myEnum)(myVal)`, will ensure that `myVal` is a
 * value of `myEnum` and return the value coerced to a value of the enum.
 * @param enumObject Enum object containing values to compare the input against.
 */
export function toEnum<T extends {}>(enumObject: T): (input: string) => T[keyof T] {
	return (input: string): T[keyof T] => {
		if (!Object.values(enumObject).includes(input)) {
			throw new UserInputError(
				`Invalid enum value: "${input}" is not in "${JSON.stringify(Object.values(enumObject))}"`
			);
		}
		return (input as unknown) as T[keyof T];
	};
}

/**
 * Query `collection` for a document matching the fields in `filter`.
 * @param filter Object with fields to use to find an object in the DB.
 * @param collection Collection to search for an object matching `filter`.
 */
export async function query<T>(filter: FilterQuery<T>, collection: Collection<T>): Promise<T> {
	const obj = await collection.findOne(filter);
	if (!obj) {
		throw new UserInputError(
			`obj with filters: "${JSON.stringify(filter)}" not found in collection "${
				collection.collectionName
			}"`
		);
	}
	return obj;
}

/**
 * Query `collection` for a document with `id`.
 * @param id ObjectId string to find in `collection`.
 * @param collection Mongo collection in which to find the object with _id `id`.
 */
export async function queryById<T extends { _id: ObjectId }>(
	id: string,
	model: Collection<T>
): Promise<T> {
	const filter = { _id: ObjectID.createFromHexString(id) };
	return query<T>(filter as FilterQuery<T>, model);
}

export async function updateUser_<T>(
	user: { email: string },
	args: MatchKeysAndValues<T>,
	collection: Collection<T>
): Promise<T> {
	const filter = { email: user.email };
	const { value } = await collection.findOneAndUpdate(
		filter as FilterQuery<T>,
		{ $set: args },
		{ returnOriginal: false }
	);
	if (!value) throw new UserInputError(`user ${user.email} not found`);
	return value;
}

/**
 * Updates the fields explicitly specified in `args` to the user specified by
 * `user`. The underlying functions will do type-checking of the passed in
 * fields, but will not verify the legitimacy of data passed in.
 * @param user Email and `userType` of user to update.
 * @param args GraphQL argument containing fields to update.
 * @param models Object containing all the models from the DB.
 * @throws UserInputError when user input strings that should be enums don't
 * 		   map to an enum.
 */
export async function updateUser(
	user: { email: string; userType: string },
	args: UserInput,
	models: Models
): Promise<UserDbInterface> {
	if (user.userType === UserType.Hacker) {
		return updateUser_(user, removeNulls(args), models.Hackers);
	}
	if (user.userType === UserType.Organizer) {
		return updateUser_(user, removeNulls(args), models.Organizers);
	}
	throw new ApolloError(`updateUser for userType ${user.userType} not implemented`);
}

/**
 * Fetch a user from the DB. This function takes care of choosing the right
 * model to use based on the userType in the object passed as param0.
 * @param param0 Email and `userType` of the user to fetch.
 * @param models Object containing all the models in the DB.
 */
export async function fetchUser(
	{ email, userType }: { email: string; userType: string },
	models: Models
): Promise<UserDbInterface> {
	if (userType === UserType.Hacker || userType === UserType.Volunteer) {
		return query({ email }, models.Hackers);
	}
	if (userType === UserType.Organizer) {
		return query({ email }, models.Organizers);
	}
	if (userType === UserType.Sponsor) {
		return query({ email }, models.Sponsors);
	}
	throw new ApolloError(`fetchUser for userType ${userType} not implemented`);
}

/**
 * Funtion to check if the user has the authorization required to continue.
 * If not, the function will throw a GraphQL AuthenticationError.
 * @param requiredType The authorization level the user should have.
 * @param user The user to check against requiredType.
 * @returns The user object, coerced to a non-null type.
 */
export function checkIsAuthorized<T extends UserDbInterface>(requiredType: UserType, user?: T): T {
	if (!user) {
		throw new AuthenticationError(`User is not logged in`);
	} else if (requiredType !== user.userType) {
		throw new AuthenticationError(
			`user ${user && user.email}: ${JSON.stringify(user)} must be a "${requiredType}"`
		);
	}

	return user;
}

/**
 * Funtion to check if the user has the authorization required to continue (checks an ARRAY of types))
 * If not, the function will throw a GraphQL AuthenticationError.
 * @param requiredType The authorization level the user should have.
 * @param user The user to check against requiredType.
 * @returns The user object, coerced to a non-null type.
 */
export function checkIsAuthorizedArray<T extends UserDbInterface>(
	requiredTypes: UserType[],
	user?: T
): T {
	if (!user || !requiredTypes.includes(user.userType as UserType)) {
		logger.info(
			`INSUFFICIENT PERMISSIONS: user ${user && user.email}: ${JSON.stringify(
				user
			)} must be one of "${requiredTypes}"`
		);
		throw new AuthenticationError('User does not have sufficient permissions to perform action');
	}

	return user;
}
