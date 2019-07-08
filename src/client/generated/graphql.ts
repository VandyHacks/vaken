import gql from 'graphql-tag';
import * as ReactApolloHooks from 'react-apollo-hooks';
import * as ReactApollo from 'react-apollo';
export type Maybe<T> = T | null;
export type MaybePromise<T> = Promise<T> | T;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
};

export type AdditionalEntityFields = {
	path?: Maybe<Scalars['String']>;
	type?: Maybe<Scalars['String']>;
};

export type ApplicationField = {
	__typename?: 'ApplicationField';
	id: Scalars['ID'];
	createdAt: Scalars['Int'];
	question: ApplicationQuestion;
	answer?: Maybe<Scalars['String']>;
};

export type ApplicationQuestion = {
	__typename?: 'ApplicationQuestion';
	prompt: Scalars['String'];
	instruction?: Maybe<Scalars['String']>;
	note?: Maybe<Scalars['String']>;
};

export enum ApplicationStatus {
	Created = 'CREATED',
	EmailVerified = 'EMAIL_VERIFIED',
	Started = 'STARTED',
	Submitted = 'SUBMITTED',
	Accepted = 'ACCEPTED',
	Confirmed = 'CONFIRMED',
	Rejected = 'REJECTED',
}

export enum AuthLevel {
	Hacker = 'HACKER',
	Organizer = 'ORGANIZER',
	Sponsor = 'SPONSOR',
}

export enum DietaryRestriction {
	Vegetarian = 'VEGETARIAN',
	Vegan = 'VEGAN',
	NutAllergy = 'NUT_ALLERGY',
	LactoseAllergy = 'LACTOSE_ALLERGY',
	GlutenFree = 'GLUTEN_FREE',
	Kosher = 'KOSHER',
	Halal = 'HALAL',
}

export enum Gender {
	Male = 'MALE',
	Female = 'FEMALE',
	Other = 'OTHER',
	PreferNotToSay = 'PREFER_NOT_TO_SAY',
}

export type Hacker = User & {
	__typename?: 'Hacker';
	id: Scalars['ID'];
	createdAt: Scalars['Int'];
	secondaryIds: Array<Scalars['ID']>;
	logins: Array<Login>;
	email: Scalars['String'];
	firstName: Scalars['String'];
	preferredName: Scalars['String'];
	lastName: Scalars['String'];
	shirtSize?: Maybe<ShirtSize>;
	gender?: Maybe<Scalars['String']>;
	dietaryRestrictions: Array<DietaryRestriction>;
	userType: UserType;
	phoneNumber?: Maybe<Scalars['String']>;
	race: Array<Race>;
	modifiedAt: Scalars['Int'];
	status: ApplicationStatus;
	school?: Maybe<Scalars['String']>;
	gradYear?: Maybe<Scalars['Int']>;
	majors: Array<Scalars['String']>;
	adult?: Maybe<Scalars['Boolean']>;
	volunteer?: Maybe<Scalars['Boolean']>;
	github?: Maybe<Scalars['String']>;
	team?: Maybe<Team>;
};

export type HackerStatusesInput = {
	ids: Array<Scalars['ID']>;
	status: ApplicationStatus;
};

export type HackerStatusInput = {
	id: Scalars['ID'];
	status: ApplicationStatus;
};

export type Login = {
	__typename?: 'Login';
	createdAt: Scalars['Int'];
	provider: LoginProvider;
	token: Scalars['ID'];
	userType: UserType;
};

export enum LoginProvider {
	Github = 'GITHUB',
	Google = 'GOOGLE',
	School = 'SCHOOL',
}

export type Mentor = User & {
	__typename?: 'Mentor';
	id: Scalars['ID'];
	createdAt: Scalars['Int'];
	secondaryIds: Array<Scalars['ID']>;
	logins: Array<Login>;
	email: Scalars['String'];
	firstName: Scalars['String'];
	preferredName: Scalars['String'];
	lastName: Scalars['String'];
	shirtSize?: Maybe<ShirtSize>;
	gender?: Maybe<Scalars['String']>;
	dietaryRestrictions: Array<DietaryRestriction>;
	userType: UserType;
	phoneNumber?: Maybe<Scalars['String']>;
	shifts: Array<Shift>;
	skills: Array<Scalars['String']>;
};

export type Mutation = {
	__typename?: 'Mutation';
	updateMyProfile: User;
	updateProfile: User;
	joinTeam: Hacker;
	leaveTeam: Hacker;
	hackerStatus: Hacker;
	hackerStatuses: Array<Hacker>;
};

export type MutationUpdateMyProfileArgs = {
	input: UserInput;
};

export type MutationUpdateProfileArgs = {
	id: Scalars['ID'];
	input: UserInput;
};

export type MutationJoinTeamArgs = {
	input: TeamInput;
};

export type MutationHackerStatusArgs = {
	input: HackerStatusInput;
};

export type MutationHackerStatusesArgs = {
	input: HackerStatusesInput;
};

export type Organizer = User & {
	__typename?: 'Organizer';
	id: Scalars['ID'];
	createdAt: Scalars['Int'];
	secondaryIds: Array<Scalars['ID']>;
	logins: Array<Login>;
	email: Scalars['String'];
	firstName: Scalars['String'];
	preferredName: Scalars['String'];
	lastName: Scalars['String'];
	shirtSize?: Maybe<ShirtSize>;
	gender?: Maybe<Scalars['String']>;
	dietaryRestrictions: Array<DietaryRestriction>;
	userType: UserType;
	phoneNumber?: Maybe<Scalars['String']>;
	permissions: Array<Maybe<Scalars['String']>>;
};

export type Query = {
	__typename?: 'Query';
	me?: Maybe<User>;
	hacker: Hacker;
	hackers: Array<Hacker>;
	organizer: Organizer;
	organizers: Array<Organizer>;
	mentor: Mentor;
	mentors: Array<Mentor>;
	team: Team;
	teams: Array<Team>;
};

export type QueryHackerArgs = {
	id: Scalars['ID'];
};

export type QueryHackersArgs = {
	sortDirection?: Maybe<SortDirection>;
};

export type QueryOrganizerArgs = {
	id: Scalars['ID'];
};

export type QueryOrganizersArgs = {
	sortDirection?: Maybe<SortDirection>;
};

export type QueryMentorArgs = {
	id: Scalars['ID'];
};

export type QueryMentorsArgs = {
	sortDirection?: Maybe<SortDirection>;
};

export type QueryTeamArgs = {
	id: Scalars['ID'];
};

export type QueryTeamsArgs = {
	sortDirection?: Maybe<SortDirection>;
};

export enum Race {
	White = 'WHITE',
	BlackOrAfricanAmerican = 'BLACK_OR_AFRICAN_AMERICAN',
	AmericanIndianOrAlaskaNative = 'AMERICAN_INDIAN_OR_ALASKA_NATIVE',
	Asian = 'ASIAN',
	NativeHawaiianPacificIslander = 'NATIVE_HAWAIIAN_PACIFIC_ISLANDER',
	HispanicOrLatino = 'HISPANIC_OR_LATINO',
}

export type Shift = {
	__typename?: 'Shift';
	begin: Scalars['Int'];
	end: Scalars['Int'];
};

export enum ShirtSize {
	Xs = 'XS',
	S = 'S',
	M = 'M',
	L = 'L',
	Xl = 'XL',
	Xxl = 'XXL',
}

export enum SortDirection {
	Asc = 'ASC',
	Desc = 'DESC',
}

export type Team = {
	__typename?: 'Team';
	id: Scalars['ID'];
	createdAt: Scalars['Int'];
	name?: Maybe<Scalars['String']>;
	memberIds: Array<Scalars['ID']>;
	size: Scalars['Int'];
};

export type TeamInput = {
	name: Scalars['String'];
};

export type User = {
	id: Scalars['ID'];
	createdAt: Scalars['Int'];
	secondaryIds: Array<Scalars['ID']>;
	logins: Array<Login>;
	email: Scalars['String'];
	firstName: Scalars['String'];
	preferredName: Scalars['String'];
	lastName: Scalars['String'];
	shirtSize?: Maybe<ShirtSize>;
	gender?: Maybe<Scalars['String']>;
	dietaryRestrictions: Array<DietaryRestriction>;
	userType: UserType;
	phoneNumber?: Maybe<Scalars['String']>;
};

export type UserInput = {
	firstName?: Maybe<Scalars['String']>;
	lastName?: Maybe<Scalars['String']>;
	email?: Maybe<Scalars['String']>;
	preferredName?: Maybe<Scalars['String']>;
	shirtSize?: Maybe<Scalars['String']>;
	gender?: Maybe<Scalars['String']>;
	dietaryRestrictions?: Maybe<Scalars['String']>;
	phoneNumber?: Maybe<Scalars['String']>;
};

export enum UserType {
	Hacker = 'HACKER',
	Mentor = 'MENTOR',
	Organizer = 'ORGANIZER',
	Sponsor = 'SPONSOR',
	SuperAdmin = 'SUPER_ADMIN',
}
export type MeQueryVariables = {};

export type MeQuery = { __typename?: 'Query' } & {
	me: Maybe<
		{ __typename?: 'Hacker' | 'Organizer' | 'Mentor' } & Pick<
			User,
			'id' | 'firstName' | 'lastName' | 'userType' | 'email'
		>
	>;
};

export type HackersQueryVariables = {};

export type HackersQuery = { __typename?: 'Query' } & {
	hackers: Array<
		{ __typename?: 'Hacker' } & Pick<
			Hacker,
			'id' | 'firstName' | 'lastName' | 'email' | 'gradYear' | 'school' | 'status'
		>
	>;
};

export type HackerStatusMutationVariables = {
	input: HackerStatusInput;
};

export type HackerStatusMutation = { __typename?: 'Mutation' } & {
	hackerStatus: { __typename?: 'Hacker' } & Pick<Hacker, 'id' | 'status'>;
};

export type HackerStatusesMutationVariables = {
	input: HackerStatusesInput;
};

export type HackerStatusesMutation = { __typename?: 'Mutation' } & {
	hackerStatuses: Array<{ __typename?: 'Hacker' } & Pick<Hacker, 'id' | 'status'>>;
};

export type MyProfileQueryVariables = {};

export type MyProfileQuery = { __typename?: 'Query' } & {
	me: Maybe<
		{ __typename?: 'Hacker' | 'Organizer' | 'Mentor' } & Pick<
			User,
			| 'id'
			| 'firstName'
			| 'lastName'
			| 'email'
			| 'preferredName'
			| 'shirtSize'
			| 'gender'
			| 'dietaryRestrictions'
			| 'phoneNumber'
		>
	>;
};

export type UpdateMyProfileMutationVariables = {
	input: UserInput;
};

export type UpdateMyProfileMutation = { __typename?: 'Mutation' } & {
	updateMyProfile: { __typename?: 'Hacker' | 'Organizer' | 'Mentor' } & Pick<
		User,
		| 'id'
		| 'firstName'
		| 'lastName'
		| 'email'
		| 'preferredName'
		| 'shirtSize'
		| 'gender'
		| 'dietaryRestrictions'
		| 'phoneNumber'
	>;
};

export type TeamQueryVariables = {};

export type TeamQuery = { __typename?: 'Query' } & {
	me: Maybe<
		{ __typename?: 'Hacker' | 'Organizer' | 'Mentor' } & Pick<User, 'id'> &
			({ __typename?: 'Hacker' } & {
				team: Maybe<{ __typename?: 'Team' } & Pick<Team, 'id' | 'name' | 'memberIds' | 'size'>>;
			})
	>;
};

export type JoinTeamMutationVariables = {
	input: TeamInput;
};

export type JoinTeamMutation = { __typename?: 'Mutation' } & {
	joinTeam: { __typename?: 'Hacker' } & Pick<Hacker, 'id'> &
		({ __typename?: 'Hacker' } & {
			team: Maybe<{ __typename?: 'Team' } & Pick<Team, 'id' | 'name' | 'memberIds' | 'size'>>;
		});
};

export type LeaveTeamMutationVariables = {};

export type LeaveTeamMutation = { __typename?: 'Mutation' } & {
	leaveTeam: { __typename?: 'Hacker' } & Pick<Hacker, 'id'> &
		({ __typename?: 'Hacker' } & {
			team: Maybe<{ __typename?: 'Team' } & Pick<Team, 'id' | 'name' | 'memberIds' | 'size'>>;
		});
};
import { ObjectID } from 'mongodb';
export type UserDbInterface = {
	_id: ObjectID;
	createdAt: Date;
	secondaryIds: Array<string>;
	logins: Array<LoginDbObject>;
	email: string;
	firstName: string;
	preferredName: string;
	lastName: string;
	shirtSize?: Maybe<string>;
	gender?: Maybe<string>;
	dietaryRestrictions: Array<string>;
	userType: string;
	phoneNumber?: Maybe<string>;
};

export type LoginDbObject = {
	createdAt: Date;
	provider: string;
	token: string;
	userType: string;
	email: string;
};

export type HackerDbObject = UserDbInterface & {
	race: Array<string>;
	modifiedAt: number;
	status: string;
	school?: Maybe<string>;
	gradYear?: Maybe<number>;
	majors: Array<string>;
	adult?: Maybe<boolean>;
	volunteer?: Maybe<boolean>;
	github?: Maybe<string>;
	team?: Maybe<TeamDbObject>;
};

export type TeamDbObject = {
	_id: ObjectID;
	createdAt: Date;
	name?: Maybe<string>;
	memberIds: Array<string>;
};

export type OrganizerDbObject = UserDbInterface & {
	permissions: Array<Maybe<string>>;
};

export type MentorDbObject = UserDbInterface & {
	shifts: Array<ShiftDbObject>;
	skills: Array<string>;
};

export type ShiftDbObject = {
	begin: Date;
	end: Date;
};

export type ApplicationQuestionDbObject = {
	prompt: string;
	instruction?: Maybe<string>;
	note?: Maybe<string>;
};

export type ApplicationFieldDbObject = {
	id: string;
	createdAt: Date;
	question: ApplicationQuestionDbObject;
	answer?: Maybe<string>;
};

export const MeDocument = gql`
	query me {
		me {
			id
			firstName
			lastName
			userType
			email
		}
	}
`;

export function useMeQuery(baseOptions?: ReactApolloHooks.QueryHookOptions<MeQueryVariables>) {
	return ReactApolloHooks.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
}
export const HackersDocument = gql`
	query hackers {
		hackers {
			id
			firstName
			lastName
			email
			gradYear
			school
			status
		}
	}
`;

export function useHackersQuery(
	baseOptions?: ReactApolloHooks.QueryHookOptions<HackersQueryVariables>
) {
	return ReactApolloHooks.useQuery<HackersQuery, HackersQueryVariables>(
		HackersDocument,
		baseOptions
	);
}
export const HackerStatusDocument = gql`
	mutation hackerStatus($input: HackerStatusInput!) {
		hackerStatus(input: $input) {
			id
			status
		}
	}
`;
export type HackerStatusMutationFn = ReactApollo.MutationFn<
	HackerStatusMutation,
	HackerStatusMutationVariables
>;

export function useHackerStatusMutation(
	baseOptions?: ReactApolloHooks.MutationHookOptions<
		HackerStatusMutation,
		HackerStatusMutationVariables
	>
) {
	return ReactApolloHooks.useMutation<HackerStatusMutation, HackerStatusMutationVariables>(
		HackerStatusDocument,
		baseOptions
	);
}
export const HackerStatusesDocument = gql`
	mutation hackerStatuses($input: HackerStatusesInput!) {
		hackerStatuses(input: $input) {
			id
			status
		}
	}
`;
export type HackerStatusesMutationFn = ReactApollo.MutationFn<
	HackerStatusesMutation,
	HackerStatusesMutationVariables
>;

export function useHackerStatusesMutation(
	baseOptions?: ReactApolloHooks.MutationHookOptions<
		HackerStatusesMutation,
		HackerStatusesMutationVariables
	>
) {
	return ReactApolloHooks.useMutation<HackerStatusesMutation, HackerStatusesMutationVariables>(
		HackerStatusesDocument,
		baseOptions
	);
}
export const MyProfileDocument = gql`
	query myProfile {
		me {
			id
			firstName
			lastName
			email
			preferredName
			shirtSize
			gender
			dietaryRestrictions
			phoneNumber
		}
	}
`;

export function useMyProfileQuery(
	baseOptions?: ReactApolloHooks.QueryHookOptions<MyProfileQueryVariables>
) {
	return ReactApolloHooks.useQuery<MyProfileQuery, MyProfileQueryVariables>(
		MyProfileDocument,
		baseOptions
	);
}
export const UpdateMyProfileDocument = gql`
	mutation updateMyProfile($input: UserInput!) {
		updateMyProfile(input: $input) {
			id
			firstName
			lastName
			email
			preferredName
			shirtSize
			gender
			dietaryRestrictions
			phoneNumber
		}
	}
`;
export type UpdateMyProfileMutationFn = ReactApollo.MutationFn<
	UpdateMyProfileMutation,
	UpdateMyProfileMutationVariables
>;

export function useUpdateMyProfileMutation(
	baseOptions?: ReactApolloHooks.MutationHookOptions<
		UpdateMyProfileMutation,
		UpdateMyProfileMutationVariables
	>
) {
	return ReactApolloHooks.useMutation<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>(
		UpdateMyProfileDocument,
		baseOptions
	);
}
export const TeamDocument = gql`
	query team {
		me {
			id
			... on Hacker {
				team {
					id
					name
					memberIds
					size
				}
			}
		}
	}
`;

export function useTeamQuery(baseOptions?: ReactApolloHooks.QueryHookOptions<TeamQueryVariables>) {
	return ReactApolloHooks.useQuery<TeamQuery, TeamQueryVariables>(TeamDocument, baseOptions);
}
export const JoinTeamDocument = gql`
	mutation joinTeam($input: TeamInput!) {
		joinTeam(input: $input) {
			id
			... on Hacker {
				team {
					id
					name
					memberIds
					size
				}
			}
		}
	}
`;
export type JoinTeamMutationFn = ReactApollo.MutationFn<
	JoinTeamMutation,
	JoinTeamMutationVariables
>;

export function useJoinTeamMutation(
	baseOptions?: ReactApolloHooks.MutationHookOptions<JoinTeamMutation, JoinTeamMutationVariables>
) {
	return ReactApolloHooks.useMutation<JoinTeamMutation, JoinTeamMutationVariables>(
		JoinTeamDocument,
		baseOptions
	);
}
export const LeaveTeamDocument = gql`
	mutation leaveTeam {
		leaveTeam {
			id
			... on Hacker {
				team {
					id
					name
					memberIds
					size
				}
			}
		}
	}
`;
export type LeaveTeamMutationFn = ReactApollo.MutationFn<
	LeaveTeamMutation,
	LeaveTeamMutationVariables
>;

export function useLeaveTeamMutation(
	baseOptions?: ReactApolloHooks.MutationHookOptions<LeaveTeamMutation, LeaveTeamMutationVariables>
) {
	return ReactApolloHooks.useMutation<LeaveTeamMutation, LeaveTeamMutationVariables>(
		LeaveTeamDocument,
		baseOptions
	);
}
