import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Application = {
  __typename?: 'Application';
  /** Filename of the user's resume, likely as a  */
  resumeFilename?: Maybe<Scalars['String']>;
  /** Signed read URL for the user's resume */
  resumeUrl?: Maybe<Scalars['String']>;
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
  /**
   * Retrieves a URL where a file may be uploaded. Individual users are only permitted
   * to upload one file, so as a side effect, requesting a new file upload URL will delete
   * any file owned by the user in storage. The corresponding file will be named after the
   * user'd primary ID, followed by the file extension provided.
   */
  fileUploadUrl?: Maybe<Scalars['String']>;
  /**
   * Associates the log in with a database entity. If a user by the corresponding email address
   * does not exist, a new user with default permissions is created.
   *
   * If the token fails validation, this is a no-op and a null user is returned.
   */
  logInUser?: Maybe<User>;
  /** Removes a user from the specified group */
  removeUserFromGroup?: Maybe<User>;
  /**
   * Retrieves a signed read url for a zip file of resumes matching all of the provided filter criteria.
   *
   * This is implemented as a mutation, as it is expensive to call.
   */
  resumeDumpUrl?: Maybe<Scalars['String']>;
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


export type MutationFileUploadUrlArgs = {
  contentType: Scalars['String'];
  fileExtension: Scalars['String'];
};


export type MutationLogInUserArgs = {
  email: Scalars['String'];
  provider: Scalars['String'];
  token: Scalars['String'];
};


export type MutationRemoveUserFromGroupArgs = {
  groupId: Scalars['ID'];
  userId: Scalars['ID'];
  userIdType?: InputMaybe<IdType>;
};


export type MutationResumeDumpUrlArgs = {
  filterCriteria?: InputMaybe<UserFilterCriteria>;
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
  /** Fetches information about the currently logged in user. May be used when a user is not logged in. */
  loggedInUser?: Maybe<User>;
  /** Returns an individual user based by ID */
  user?: Maybe<User>;
  /** Returns list of all users. */
  users: Array<User>;
};


export type QueryGroupArgs = {
  groupId: Scalars['ID'];
};


export type QueryGroupsArgs = {
  after?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
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
  /** Group the user is a part of. Allows a user to own events and delegate their group's permissions to other users. */
  groups?: Maybe<Array<Group>>;
  /** User's unique identifier */
  id: Scalars['ID'];
  /** Computes the effective roles granted to a user, accounting for group roles and anti-roles */
  roles?: Maybe<Array<Role>>;
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

export type HackersQueryVariables = Exact<{ [key: string]: never; }>;


export type HackersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, email?: string | null }> };

export type UserQueryVariables = Exact<{
  id: Scalars['ID'];
  idType?: InputMaybe<IdType>;
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, email?: string | null } | null };


export const HackersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Hackers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10000"}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"APPLICATION_SUBMITTED"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<HackersQuery, HackersQueryVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"User"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IdType"}},"defaultValue":{"kind":"EnumValue","value":"PRIMARY"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"idType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;