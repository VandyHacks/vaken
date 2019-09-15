import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { ObjectID } from 'mongodb';
import {
	HackerDbObject,
	OrganizerDbObject,
	EventDbObject,
	ShirtSize,
	UserDbInterface,
	UserType,
} from '../generated/graphql';
import Context from '../context';
import {
	fetchUser,
	query,
	queryById,
	toEnum,
	updateUser,
	checkIsAuthorized,
} from '../resolvers/helpers';
import { Models } from '../models';
