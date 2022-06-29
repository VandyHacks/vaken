import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  _FieldSet: any;
};

export type AdditionalEntityFields = {
  path?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

/** Enum to disambiguate which identifier is supplied. */
export enum IdType {
  /** The user's email */
  Email = 'EMAIL',
  /** Primary ID, such as the User's `id` field */
  Primary = 'PRIMARY',
  /** Secondary ID, such as an NFC tag id contained in the User's `secondaryIds` field */
  Secondary = 'SECONDARY'
}

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Associates the log in with a database entity. If a user by the corresponding email address
   * does not exist, a new user with default permissions is created.
   *
   * If the token fails validation, this is a no-op and a null user is returned.
   */
  logInUser?: Maybe<User>;
};


export type MutationLogInUserArgs = {
  email: Scalars['String'];
  provider: Scalars['String'];
  token: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  /** Fetches information about the currently logged in user. May be used when a user is not logged in. */
  loggedInUser?: Maybe<User>;
  /** Returns an individual user based by ID */
  user?: Maybe<User>;
  /** Returns list of all users. */
  users: Array<User>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
  idType?: InputMaybe<IdType>;
};


export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['ID']>;
  filter?: InputMaybe<UserFilter>;
  first?: InputMaybe<Scalars['Int']>;
};

/**
 * Roles the user has. Each role confers permissions for a fine-grained action.
 *
 * Must be kept in sync with definitions in other subgraphs.
 */
export enum Role {
  Hacker = 'HACKER',
  Organizer = 'ORGANIZER',
  Sponsor = 'SPONSOR',
  SuperAdmin = 'SUPER_ADMIN',
  Volunteer = 'VOLUNTEER'
}

/**
 * Logical representation of a user. This type is extended with domain-specific
 * fields in various subgraphs.
 */
export type User = {
  __typename?: 'User';
  /** Time the user was created, in milliseconds since the unix epoch. Float is required for millisecond precision. */
  createdAt?: Maybe<Scalars['Float']>;
  /** Email of the user */
  email?: Maybe<Scalars['String']>;
  /** Whether the user has unsubscribed from emails from VandyHacks. If so, this user should not be sent further emails */
  emailUnsubscribed?: Maybe<Scalars['Boolean']>;
  /** User's unique identifier */
  id: Scalars['ID'];
  /**
   * Roles the user has been explicitly conferred. Note that these roles may not be indicative of a user's capabilities, as
   * the groups subgraph may contribute additional or mask explicitly conferred roles. See `roles` in the groups subgraph.
   */
  selfRoles?: Maybe<Array<Role>>;
};

/** Possible filters for users */
export enum UserFilter {
  /** Returns all users. Does not filter results */
  All = 'ALL',
  /** Hackers who have filled out their application */
  ApplicationSubmitted = 'APPLICATION_SUBMITTED',
  /** Users with the `APPLY` role */
  Hackers = 'HACKERS'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ReferenceResolver<TResult, TReference, TContext> = (
      reference: TReference,
      context: TContext,
      info: GraphQLResolveInfo
    ) => Promise<TResult> | TResult;

      type ScalarCheck<T, S> = S extends true ? T : NullableCheck<T, S>;
      type NullableCheck<T, S> = Maybe<T> extends T ? Maybe<ListCheck<NonNullable<T>, S>> : ListCheck<T, S>;
      type ListCheck<T, S> = T extends (infer U)[] ? NullableCheck<U, S>[] : GraphQLRecursivePick<T, S>;
      export type GraphQLRecursivePick<T, S> = { [K in keyof T & keyof S]: ScalarCheck<T[K], S[K]> };
    

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

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
  AdditionalEntityFields: AdditionalEntityFields;
  String: ResolverTypeWrapper<Scalars['String']>;
  IdType: IdType;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Role: Role;
  User: ResolverTypeWrapper<User>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  UserFilter: UserFilter;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AdditionalEntityFields: AdditionalEntityFields;
  String: Scalars['String'];
  Mutation: {};
  Query: {};
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  User: User;
  Float: Scalars['Float'];
  Boolean: Scalars['Boolean'];
};

export type UnionDirectiveArgs = {
  discriminatorField?: Maybe<Scalars['String']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type UnionDirectiveResolver<Result, Parent, ContextType = any, Args = UnionDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveArgs = {
  discriminatorField: Scalars['String'];
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type AbstractEntityDirectiveResolver<Result, Parent, ContextType = any, Args = AbstractEntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {
  embedded?: Maybe<Scalars['Boolean']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type EntityDirectiveResolver<Result, Parent, ContextType = any, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveArgs = {
  overrideType?: Maybe<Scalars['String']>;
};

export type ColumnDirectiveResolver<Result, Parent, ContextType = any, Args = ColumnDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = { };

export type IdDirectiveResolver<Result, Parent, ContextType = any, Args = IdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = {
  overrideType?: Maybe<Scalars['String']>;
};

export type LinkDirectiveResolver<Result, Parent, ContextType = any, Args = LinkDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = { };

export type EmbeddedDirectiveResolver<Result, Parent, ContextType = any, Args = EmbeddedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveArgs = {
  path: Scalars['String'];
};

export type MapDirectiveResolver<Result, Parent, ContextType = any, Args = MapDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  logInUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationLogInUserArgs, 'email' | 'provider' | 'token'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  loggedInUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id' | 'idType'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUsersArgs, 'filter' | 'first'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['User']>, { __typename: 'User' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  emailUnsubscribed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  selfRoles?: Resolver<Maybe<Array<ResolversTypes['Role']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

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

import { ObjectId } from 'mongodb';
export type UserDbObject = {
  createdAt?: Date,
  email?: Maybe<string>,
  emailUnsubscribed?: Maybe<boolean>,
  _id: ObjectId,
  selfRoles?: Maybe<Array<string>>,
  providers: Array<{ provider: string, token: string }>,
};
