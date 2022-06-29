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

/** Arbitrary grouping of users, designed to allow flexible representations of sponsors, organizers, and teams. */
export type Group = {
  __typename?: 'Group';
  /**
   * Roles that group members are not permitted to have.
   *
   * For example, this field may be used to remove the `APPLY` role from sponsors represented as groups.
   */
  antiRoles?: Maybe<Array<Role>>;
  /** Creation time, in milliseconds since the Unix epoch. Float is required for millisecond precision */
  createdAt?: Maybe<Scalars['Float']>;
  /** ID of the group */
  id: Scalars['ID'];
  /** List of users in the group */
  members?: Maybe<Array<User>>;
  /** Name of the group, suitable for public display */
  name?: Maybe<Scalars['String']>;
  /** Roles that group members are granted */
  roles?: Maybe<Array<Role>>;
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
  /** Adds a user to the specified group, either by primary user ID or email */
  addUserToGroup?: Maybe<User>;
  /** Creates and returns a group with the specified name */
  createGroup: Group;
  /** Removes a user from the specified group */
  removeUserFromGroup?: Maybe<User>;
  /** Updates the specified group's roles to match those specified */
  setGroupRoles?: Maybe<Group>;
};


export type MutationAddUserToGroupArgs = {
  groupId: Scalars['ID'];
  userId: Scalars['ID'];
  userIdType?: InputMaybe<IdType>;
};


export type MutationCreateGroupArgs = {
  name: Scalars['String'];
};


export type MutationRemoveUserFromGroupArgs = {
  groupId: Scalars['ID'];
  userId: Scalars['ID'];
  userIdType?: InputMaybe<IdType>;
};


export type MutationSetGroupRolesArgs = {
  antiRoles: Array<Role>;
  groupId: Scalars['String'];
  roles: Array<Role>;
};

export type Query = {
  __typename?: 'Query';
  /** Returns an individual group by ID */
  group?: Maybe<Group>;
  /** Returns list of all groups */
  groups: Array<Group>;
};


export type QueryGroupArgs = {
  groupId: Scalars['ID'];
};


export type QueryGroupsArgs = {
  after?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
};

/** Roles able to be conferred to a user. Primary definition in Users subgraph. Must be kept in sync. */
export enum Role {
  Hacker = 'HACKER',
  Organizer = 'ORGANIZER',
  Sponsor = 'SPONSOR',
  SuperAdmin = 'SUPER_ADMIN',
  Volunteer = 'VOLUNTEER'
}

export type User = {
  __typename?: 'User';
  /** Group the user is a part of. Allows a user to own events and delegate their group's permissions to other users. */
  groups?: Maybe<Array<Group>>;
  id: Scalars['ID'];
  /** Computes the effective roles granted to a user, accounting for group roles and anti-roles */
  roles?: Maybe<Array<Role>>;
  selfRoles?: Maybe<Array<Role>>;
};



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
  Group: ResolverTypeWrapper<Group>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  IdType: IdType;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Role: Role;
  User: ResolverTypeWrapper<User>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AdditionalEntityFields: AdditionalEntityFields;
  String: Scalars['String'];
  Group: Group;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Mutation: {};
  Query: {};
  Int: Scalars['Int'];
  User: User;
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

export type GroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Group']>, { __typename: 'Group' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  antiRoles?: Resolver<Maybe<Array<ResolversTypes['Role']>>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  members?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  roles?: Resolver<Maybe<Array<ResolversTypes['Role']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addUserToGroup?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationAddUserToGroupArgs, 'groupId' | 'userId' | 'userIdType'>>;
  createGroup?: Resolver<ResolversTypes['Group'], ParentType, ContextType, RequireFields<MutationCreateGroupArgs, 'name'>>;
  removeUserFromGroup?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationRemoveUserFromGroupArgs, 'groupId' | 'userId' | 'userIdType'>>;
  setGroupRoles?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType, RequireFields<MutationSetGroupRolesArgs, 'antiRoles' | 'groupId' | 'roles'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType, RequireFields<QueryGroupArgs, 'groupId'>>;
  groups?: Resolver<Array<ResolversTypes['Group']>, ParentType, ContextType, RequireFields<QueryGroupsArgs, 'first'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['User']>, { __typename: 'User' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  groups?: Resolver<Maybe<Array<ResolversTypes['Group']>>, { __typename: 'User' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;

  roles?: Resolver<Maybe<Array<ResolversTypes['Role']>>, { __typename: 'User' } & GraphQLRecursivePick<ParentType, {"id":true}> & GraphQLRecursivePick<ParentType, {"groups":{"roles":true,"antiRoles":true},"selfRoles":true}>, ContextType>;

  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Group?: GroupResolvers<ContextType>;
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
export type GroupDbObject = {
  antiRoles?: Maybe<Array<string>>,
  createdAt?: Date,
  _id: ObjectId,
  members?: Array<ObjectId>,
  name?: Maybe<string>,
  roles?: Maybe<Array<string>>,
};
