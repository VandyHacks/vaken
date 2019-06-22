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
	race: Array<Race>;
	modifiedAt: Scalars['Int'];
	status: ApplicationStatus;
	school?: Maybe<Scalars['String']>;
	gradYear?: Maybe<Scalars['Int']>;
	majors: Array<Scalars['String']>;
	adult?: Maybe<Scalars['Boolean']>;
	volunteer?: Maybe<Scalars['Boolean']>;
	github?: Maybe<Scalars['String']>;
	teamCode?: Maybe<Scalars['ID']>;
};

export type Login = {
	__typename?: 'Login';
	createdAt: Scalars['Int'];
	provider: LoginProvider;
	token: Scalars['ID'];
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
	permissions: Array<Maybe<Scalars['String']>>;
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

export type Team = {
	__typename?: 'Team';
	id: Scalars['ID'];
	createdAt: Scalars['Int'];
	name?: Maybe<Scalars['String']>;
	members: Array<Hacker>;
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
};

export enum UserType {
	Hacker = 'HACKER',
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
	String: MaybePromise<Scalars['String']>;
	Boolean: MaybePromise<Scalars['Boolean']>;
	User: MaybePromise<User>;
	ID: MaybePromise<Scalars['ID']>;
	Int: MaybePromise<Scalars['Int']>;
	Login: MaybePromise<Login>;
	LoginProvider: LoginProvider;
	ShirtSize: ShirtSize;
	DietaryRestriction: DietaryRestriction;
	Race: Race;
	AuthLevel: AuthLevel;
	Gender: Gender;
	ApplicationStatus: ApplicationStatus;
	UserType: UserType;
	ApplicationQuestion: MaybePromise<ApplicationQuestion>;
	ApplicationField: MaybePromise<ApplicationField>;
	Hacker: MaybePromise<Hacker>;
	Shift: MaybePromise<Shift>;
	Mentor: MaybePromise<Mentor>;
	Team: MaybePromise<Team>;
	Organizer: MaybePromise<Organizer>;
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
	race?: Resolver<Array<ResolversTypes['Race']>, ParentType, ContextType>;
	modifiedAt?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
	status?: Resolver<ResolversTypes['ApplicationStatus'], ParentType, ContextType>;
	school?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
	gradYear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
	majors?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
	adult?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
	volunteer?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
	github?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
	teamCode?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
};

export type LoginResolvers<ContextType = any, ParentType = ResolversTypes['Login']> = {
	createdAt?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
	provider?: Resolver<ResolversTypes['LoginProvider'], ParentType, ContextType>;
	token?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
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
	race?: Resolver<Array<ResolversTypes['Race']>, ParentType, ContextType>;
	shifts?: Resolver<Array<ResolversTypes['Shift']>, ParentType, ContextType>;
	skills?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
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
	race?: Resolver<Array<ResolversTypes['Race']>, ParentType, ContextType>;
	permissions?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
};

export type ShiftResolvers<ContextType = any, ParentType = ResolversTypes['Shift']> = {
	begin?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
	end?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type TeamResolvers<ContextType = any, ParentType = ResolversTypes['Team']> = {
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
	createdAt?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
	name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
	members?: Resolver<Array<ResolversTypes['Hacker']>, ParentType, ContextType>;
	size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType = ResolversTypes['User']> = {
	__resolveType: TypeResolveFn<'Hacker' | 'Mentor' | 'Organizer', ParentType, ContextType>;
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
	race?: Resolver<Array<ResolversTypes['Race']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
	ApplicationField?: ApplicationFieldResolvers<ContextType>;
	ApplicationQuestion?: ApplicationQuestionResolvers<ContextType>;
	Hacker?: HackerResolvers<ContextType>;
	Login?: LoginResolvers<ContextType>;
	Mentor?: MentorResolvers<ContextType>;
	Organizer?: OrganizerResolvers<ContextType>;
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
	race: Array<string>;
	userType: string;
};

export type LoginDbObject = {
	createdAt: Date;
	provider: string;
	_id: ObjectID;
	email: string;
	type: UserType;
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

export type HackerDbObject = UserDbInterface & {
	modifiedAt: number;
	status: string;
	school?: Maybe<string>;
	gradYear?: Maybe<number>;
	majors: Array<string>;
	adult?: Maybe<boolean>;
	volunteer?: Maybe<boolean>;
	github?: Maybe<string>;
	teamCode?: Maybe<string>;
};

export type ShiftDbObject = {
	begin: Date;
	end: Date;
};

export type MentorDbObject = UserDbInterface & {
	shifts: Array<ShiftDbObject>;
	skills: Array<string>;
};

export type OrganizerDbObject = UserDbInterface & {
	permissions: Array<Maybe<string>>;
};
