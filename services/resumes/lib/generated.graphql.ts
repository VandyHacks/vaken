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

export type Application = {
  __typename?: 'Application';
  /** Filename of the user's resume, likely as a  */
  resumeFilename?: Maybe<Scalars['String']>;
  /** Signed read URL for the user's resume */
  resumeUrl?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Retrieves a URL where a file may be uploaded. Individual users are only permitted
   * to upload one file, so as a side effect, requesting a new file upload URL will delete
   * any file owned by the user in storage. The corresponding file will be named after the
   * user'd primary ID, followed by the file extension provided.
   */
  fileUploadUrl?: Maybe<Scalars['String']>;
  /**
   * Retrieves a signed read url for a zip file of resumes matching all of the provided filter criteria.
   *
   * This is implemented as a mutation, as it is expensive to call.
   */
  resumeDumpUrl?: Maybe<Scalars['String']>;
};


export type MutationFileUploadUrlArgs = {
  contentType: Scalars['String'];
  fileExtension: Scalars['String'];
};


export type MutationResumeDumpUrlArgs = {
  filterCriteria?: InputMaybe<UserFilterCriteria>;
};

/**
 * Filter criteria for creating a resume dump. Uses regex matching of field values to limit the
 * number of returned resumes. If a field is omitted from this type, it is not considered during
 * filtering of users.
 */
export type UserFilterCriteria = {
  /** Regex to match against the users' application status */
  applicationStatus?: InputMaybe<Scalars['String']>;
  /** Regex to match against the users' provided gender */
  gender?: InputMaybe<Scalars['String']>;
  /** Regex to match against the users' provided grad year */
  gradYear?: InputMaybe<Scalars['String']>;
  /** Regex to match against the users' provided major(s) */
  major?: InputMaybe<Scalars['String']>;
  /** Regex to match against the users' provided race(s) */
  race?: InputMaybe<Scalars['String']>;
  /** Regex to match against the users' provided school */
  school?: InputMaybe<Scalars['String']>;
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
  Application: ResolverTypeWrapper<Application>;
  Mutation: ResolverTypeWrapper<{}>;
  UserFilterCriteria: UserFilterCriteria;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AdditionalEntityFields: AdditionalEntityFields;
  String: Scalars['String'];
  Application: Application;
  Mutation: {};
  UserFilterCriteria: UserFilterCriteria;
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

export type ApplicationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Application'] = ResolversParentTypes['Application']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Application']>, { __typename: 'Application' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  resumeFilename?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  resumeUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  fileUploadUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationFileUploadUrlArgs, 'contentType' | 'fileExtension'>>;
  resumeDumpUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationResumeDumpUrlArgs>>;
};

export type Resolvers<ContextType = any> = {
  Application?: ApplicationResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
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