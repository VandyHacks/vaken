import gql from 'graphql-tag';
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
	race: Array<Race>;
	userType: UserType;
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
	race: Array<Race>;
	userType: UserType;
	shifts: Array<Shift>;
	skills: Array<Scalars['String']>;
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
	race: Array<Race>;
	userType: UserType;
	permissions: Array<Maybe<Scalars['String']>>;
};

export type Query = {
	__typename?: 'Query';
	me: User;
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
	Uxs = 'UXS',
	Us = 'US',
	Um = 'UM',
	Ul = 'UL',
	Uxl = 'UXL',
	Uxxl = 'UXXL',
	Ws = 'WS',
	Wm = 'WM',
	Wl = 'WL',
	Wxl = 'WXL',
	Wxxl = 'WXXL',
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
	race: Array<Race>;
	userType: UserType;
};

export enum UserType {
	Hacker = 'HACKER',
	Mentor = 'MENTOR',
	Organizer = 'ORGANIZER',
	Sponsor = 'SPONSOR',
	SuperAdmin = 'SUPER_ADMIN',
}
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
	race: Array<string>;
	userType: string;
};

export type LoginDbObject = {
	createdAt: Date;
	provider: string;
	token: string;
	userType: string;
	email: string;
	type: UserType;
};

export type HackerDbObject = UserDbInterface & {
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
