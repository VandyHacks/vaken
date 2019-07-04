import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type MaybePromise<T> = Promise<T> | T;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
};

export type MutationUpdateMyProfileArgs = {
	input: UserInputType;
};

export type MutationUpdateProfileArgs = {
	id: Scalars['ID'];
	input: UserInputType;
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
	userType: UserType;
	phoneNumber?: Maybe<Scalars['String']>;
};

export type UserInputType = {
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

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
	fragment: string;
	resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
	| ResolverFn<TResult, TParent, TContext, TArgs>
	| StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
	subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
	resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
	| ((...args: any[]) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
	| SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
	parent: TParent,
	context: TContext,
	info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
	next: NextResolverFn<TResult>,
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
	Query: MaybePromise<{}>;
	User: MaybePromise<UserDbInterface>;
	ID: MaybePromise<Scalars['ID']>;
	Int: MaybePromise<Scalars['Int']>;
	Login: MaybePromise<LoginDbObject>;
	LoginProvider: LoginProvider;
	UserType: UserType;
	String: MaybePromise<Scalars['String']>;
	ShirtSize: ShirtSize;
	DietaryRestriction: DietaryRestriction;
	Hacker: MaybePromise<HackerDbObject>;
	Race: Race;
	ApplicationStatus: ApplicationStatus;
	Boolean: MaybePromise<Scalars['Boolean']>;
	Team: MaybePromise<TeamDbObject>;
	SortDirection: SortDirection;
	Organizer: MaybePromise<OrganizerDbObject>;
	Mentor: MaybePromise<MentorDbObject>;
	Shift: MaybePromise<ShiftDbObject>;
	Mutation: MaybePromise<{}>;
	UserInputType: UserInputType;
	AuthLevel: AuthLevel;
	Gender: Gender;
	ApplicationQuestion: MaybePromise<ApplicationQuestionDbObject>;
	ApplicationField: MaybePromise<ApplicationFieldDbObject>;
	AdditionalEntityFields: AdditionalEntityFields;
};

export type UnionDirectiveResolver<
	Result,
	Parent,
	ContextType = any,
	Args = {
		discriminatorField?: Maybe<Maybe<Scalars['String']>>;
		additionalFields?: Maybe<Maybe<Array<Maybe<AdditionalEntityFields>>>>;
	}
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveResolver<
	Result,
	Parent,
	ContextType = any,
	Args = {
		discriminatorField?: Maybe<Scalars['String']>;
		additionalFields?: Maybe<Maybe<Array<Maybe<AdditionalEntityFields>>>>;
	}
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveResolver<
	Result,
	Parent,
	ContextType = any,
	Args = {
		embedded?: Maybe<Maybe<Scalars['Boolean']>>;
		additionalFields?: Maybe<Maybe<Array<Maybe<AdditionalEntityFields>>>>;
	}
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveResolver<
	Result,
	Parent,
	ContextType = any,
	Args = { overrideType?: Maybe<Maybe<Scalars['String']>> }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveResolver<Result, Parent, ContextType = any, Args = {}> = DirectiveResolverFn<
	Result,
	Parent,
	ContextType,
	Args
>;

export type LinkDirectiveResolver<
	Result,
	Parent,
	ContextType = any,
	Args = { overrideType?: Maybe<Maybe<Scalars['String']>> }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveResolver<
	Result,
	Parent,
	ContextType = any,
	Args = {}
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveResolver<
	Result,
	Parent,
	ContextType = any,
	Args = { path?: Maybe<Scalars['String']> }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ApplicationFieldResolvers<
	ContextType = any,
	ParentType = ResolversTypes['ApplicationField']
> = {
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
	createdAt?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
	question?: Resolver<ResolversTypes['ApplicationQuestion'], ParentType, ContextType>;
	answer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type ApplicationQuestionResolvers<
	ContextType = any,
	ParentType = ResolversTypes['ApplicationQuestion']
> = {
	prompt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	instruction?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
	note?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type HackerResolvers<ContextType = any, ParentType = ResolversTypes['Hacker']> = {
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
	createdAt?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
	secondaryIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
	logins?: Resolver<Array<ResolversTypes['Login']>, ParentType, ContextType>;
	email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	preferredName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	shirtSize?: Resolver<Maybe<ResolversTypes['ShirtSize']>, ParentType, ContextType>;
	gender?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
	dietaryRestrictions?: Resolver<
		Array<ResolversTypes['DietaryRestriction']>,
		ParentType,
		ContextType
	>;
	userType?: Resolver<ResolversTypes['UserType'], ParentType, ContextType>;
	phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
	race?: Resolver<Array<ResolversTypes['Race']>, ParentType, ContextType>;
	modifiedAt?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
	status?: Resolver<ResolversTypes['ApplicationStatus'], ParentType, ContextType>;
	school?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
	gradYear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
	majors?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
	adult?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
	volunteer?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
	github?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
	team?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType>;
};

export type LoginResolvers<ContextType = any, ParentType = ResolversTypes['Login']> = {
	createdAt?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
	provider?: Resolver<ResolversTypes['LoginProvider'], ParentType, ContextType>;
	token?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
	userType?: Resolver<ResolversTypes['UserType'], ParentType, ContextType>;
};

export type MentorResolvers<ContextType = any, ParentType = ResolversTypes['Mentor']> = {
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
	createdAt?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
	secondaryIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
	logins?: Resolver<Array<ResolversTypes['Login']>, ParentType, ContextType>;
	email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	preferredName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	shirtSize?: Resolver<Maybe<ResolversTypes['ShirtSize']>, ParentType, ContextType>;
	gender?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
	dietaryRestrictions?: Resolver<
		Array<ResolversTypes['DietaryRestriction']>,
		ParentType,
		ContextType
	>;
	userType?: Resolver<ResolversTypes['UserType'], ParentType, ContextType>;
	phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
	shifts?: Resolver<Array<ResolversTypes['Shift']>, ParentType, ContextType>;
	skills?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType = ResolversTypes['Mutation']> = {
	updateMyProfile?: Resolver<
		ResolversTypes['User'],
		ParentType,
		ContextType,
		MutationUpdateMyProfileArgs
	>;
	updateProfile?: Resolver<
		ResolversTypes['User'],
		ParentType,
		ContextType,
		MutationUpdateProfileArgs
	>;
};

export type OrganizerResolvers<ContextType = any, ParentType = ResolversTypes['Organizer']> = {
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
	createdAt?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
	secondaryIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
	logins?: Resolver<Array<ResolversTypes['Login']>, ParentType, ContextType>;
	email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	preferredName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	shirtSize?: Resolver<Maybe<ResolversTypes['ShirtSize']>, ParentType, ContextType>;
	gender?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
	dietaryRestrictions?: Resolver<
		Array<ResolversTypes['DietaryRestriction']>,
		ParentType,
		ContextType
	>;
	userType?: Resolver<ResolversTypes['UserType'], ParentType, ContextType>;
	phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
	permissions?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType = ResolversTypes['Query']> = {
	me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
	hacker?: Resolver<ResolversTypes['Hacker'], ParentType, ContextType, QueryHackerArgs>;
	hackers?: Resolver<Array<ResolversTypes['Hacker']>, ParentType, ContextType, QueryHackersArgs>;
	organizer?: Resolver<ResolversTypes['Organizer'], ParentType, ContextType, QueryOrganizerArgs>;
	organizers?: Resolver<
		Array<ResolversTypes['Organizer']>,
		ParentType,
		ContextType,
		QueryOrganizersArgs
	>;
	mentor?: Resolver<ResolversTypes['Mentor'], ParentType, ContextType, QueryMentorArgs>;
	mentors?: Resolver<Array<ResolversTypes['Mentor']>, ParentType, ContextType, QueryMentorsArgs>;
	team?: Resolver<ResolversTypes['Team'], ParentType, ContextType, QueryTeamArgs>;
	teams?: Resolver<Array<ResolversTypes['Team']>, ParentType, ContextType, QueryTeamsArgs>;
};

export type ShiftResolvers<ContextType = any, ParentType = ResolversTypes['Shift']> = {
	begin?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
	end?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type TeamResolvers<ContextType = any, ParentType = ResolversTypes['Team']> = {
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
	createdAt?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
	name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
	memberIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
	size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType = ResolversTypes['User']> = {
	__resolveType: TypeResolveFn<'Hacker' | 'Organizer' | 'Mentor', ParentType, ContextType>;
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
	createdAt?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
	secondaryIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
	logins?: Resolver<Array<ResolversTypes['Login']>, ParentType, ContextType>;
	email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	preferredName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	shirtSize?: Resolver<Maybe<ResolversTypes['ShirtSize']>, ParentType, ContextType>;
	gender?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
	dietaryRestrictions?: Resolver<
		Array<ResolversTypes['DietaryRestriction']>,
		ParentType,
		ContextType
	>;
	userType?: Resolver<ResolversTypes['UserType'], ParentType, ContextType>;
	phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
	ApplicationField?: ApplicationFieldResolvers<ContextType>;
	ApplicationQuestion?: ApplicationQuestionResolvers<ContextType>;
	Hacker?: HackerResolvers<ContextType>;
	Login?: LoginResolvers<ContextType>;
	Mentor?: MentorResolvers<ContextType>;
	Mutation?: MutationResolvers<ContextType>;
	Organizer?: OrganizerResolvers<ContextType>;
	Query?: QueryResolvers<ContextType>;
	Shift?: ShiftResolvers<ContextType>;
	Team?: TeamResolvers<ContextType>;
	User?: UserResolvers;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = {
	union?: UnionDirectiveResolver<any, any, ContextType>;
	abstractEntity?: AbstractEntityDirectiveResolver<any, any, ContextType>;
	entity?: EntityDirectiveResolver<any, any, ContextType>;
	column?: ColumnDirectiveResolver<any, any, ContextType>;
	id?: IdDirectiveResolver<any, any, ContextType>;
	link?: LinkDirectiveResolver<any, any, ContextType>;
	embedded?: EmbeddedDirectiveResolver<any, any, ContextType>;
	map?: MapDirectiveResolver<any, any, ContextType>;
};

/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<ContextType>;
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
	type: UserType;
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
