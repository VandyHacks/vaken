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

/** Whether or not the hacker is of legal age to attend the hackathon. */
export enum AgeEligibility {
  /** The hacker is old enough to attend the hackathon. For VandyHacks, this indicates the hacker is over 18. */
  Eligible = 'ELIGIBLE',
  /** The hacker is too young to attend the hackathon. For VandyHacks, this indicates their are under 18 years old. */
  Ineligible = 'INELIGIBLE'
}

/**
 * Represents information provided by a hacker attempting to apply to the hackathon.
 * No fields in this type are guaranteed to be present under any circumstances.
 *
 * Not all fields in the form hackers fill out are present in this type, to allow
 * computation of stats for common fields as well as allowing for easy
 * extensibility.
 *
 * All explicit fields in this type must be manually extracted in the
 * SubmitApplication resolver using the ApplicationField.field entry and set in the
 * corresponding field of this type set, else it will not be populated. Application
 * fields not explicitly present in this type may be accessed via the "application" array.
 */
export type Application = {
  __typename?: 'Application';
  /** Whether the hacker is a legal adult, for legal compliance purposes */
  adult?: Maybe<AgeEligibility>;
  /** Array of application fields not extracted into structured fields above */
  application: Array<ApplicationField>;
  /** Dietary restrictions of the hacker, for food ordering purposes */
  dietaryRestrictions?: Maybe<DietaryRestrictionsWithOther>;
  /** Legal first name of the hacker */
  firstName?: Maybe<Scalars['String']>;
  /** Gender of the hacker, for demographic purposes */
  gender?: Maybe<GenderWithOther>;
  /** Year the hacker graduates/ed from their school */
  gradYear?: Maybe<Scalars['String']>;
  /** Legal last name of the hacker */
  lastName?: Maybe<Scalars['String']>;
  /** Majors of the hacker, for demographic purposes */
  majors: Array<Scalars['String']>;
  /** When the hacker's application was last saved, in milliseconds since the unix epoch */
  modifiedAt?: Maybe<Scalars['Int']>;
  /** Preferred first name of the hacker */
  preferredName?: Maybe<Scalars['String']>;
  /** Race of the hacker, for demographic purposes */
  race?: Maybe<RacesWithOther>;
  /** Filename of the user's resume, likely as a  */
  resumeFilename?: Maybe<Scalars['String']>;
  /** Signed read URL for the user's resume */
  resumeUrl?: Maybe<Scalars['String']>;
  /** School the hacker attends/attended */
  school?: Maybe<Scalars['String']>;
  /** Shirt size specified for the hacker, for swag purchasing purposes */
  shirtSize?: Maybe<ShirtSize>;
  /** Status of the user's application. Indicates if the user has been accepted. */
  status?: Maybe<ApplicationStatus>;
  /** ID of the user this application belongs to. Used primarily to link this GraphQL entity with other services */
  userId: Scalars['ID'];
  /** Whether the hacker opted to volunteer to help out during the hackathon */
  volunteer?: Maybe<VolunteerOption>;
};

/** Generic representation of fields and responses */
export type ApplicationField = {
  __typename?: 'ApplicationField';
  /** Field name of the question */
  field?: Maybe<Scalars['String']>;
  /** If the question is a text-response, the user's response, else a json-serialized representation of structured data */
  response?: Maybe<Scalars['String']>;
};

/** Status of the hacker's application, as defined by it's level of completion at time of saving their application or acceptance status. */
export enum ApplicationStatus {
  /** Hacker has finished their application and been accepted to the hackathon */
  Accepted = 'ACCEPTED',
  /** Hacker has been confirmed as in-attendance at the hackathon */
  Attended = 'ATTENDED',
  /** Hacker has been accepted to the hackathon and has confirmed they will attend */
  Confirmed = 'CONFIRMED',
  /** Hacker has been created, but their application is not yet started */
  Created = 'CREATED',
  /** Hacker was accepted to the hackathon, but declined their offer to attend */
  Declined = 'DECLINED',
  /** Hacker hash finished their application, but was not accepted to the hackathon */
  Rejected = 'REJECTED',
  /** Hacker has started their application, but has not yet filled out all required fields */
  Started = 'STARTED',
  /** Hacker has finished their application, but it has not yet been reviewed */
  Submitted = 'SUBMITTED'
}

/**
 * Enumeration of common dietary restrictions, chosen based on the list of restrictions
 * hackathon organizers can reasonably fulfil.
 */
export enum DietaryRestriction {
  GlutenFree = 'GLUTEN_FREE',
  Halal = 'HALAL',
  Kosher = 'KOSHER',
  LactoseAllergy = 'LACTOSE_ALLERGY',
  NutAllergy = 'NUT_ALLERGY',
  Vegan = 'VEGAN',
  Vegetarian = 'VEGETARIAN'
}

/** Container for combination of `Race` enum values as well as free-text "other" field. */
export type DietaryRestrictionsWithOther = {
  __typename?: 'DietaryRestrictionsWithOther';
  /** User-provided multiselect selections for their dietary restrictions. If no selections are made, will be empty array. */
  dietaryRestriction: Array<DietaryRestriction>;
  /** User-provided 'other' text for their dietary restrictions. */
  other?: Maybe<Scalars['String']>;
};

/** Represents an event taking place during the hackathon */
export type Event = {
  __typename?: 'Event';
  /** Set of IDs of users who attended the event */
  attendees?: Maybe<Array<User>>;
  /** List of user check-ins, in order of checking in */
  checkins?: Maybe<Array<EventCheckIn>>;
  /** Description of the event */
  description?: Maybe<Scalars['String']>;
  /** Duration of the event, in milliseconds */
  duration?: Maybe<Scalars['Int']>;
  /** How much the event is worth in the event scoring system */
  eventScore?: Maybe<Scalars['Int']>;
  /** Type of the event */
  eventType?: Maybe<Scalars['String']>;
  /** unique ID of the event */
  id: Scalars['ID'];
  /** Human-readable location of where the event takes place */
  location?: Maybe<Scalars['String']>;
  /** Name of the event, suitable for public display */
  name?: Maybe<Scalars['String']>;
  /** Group that owns the event, if owned by a specific group */
  owner?: Maybe<Group>;
  /** Start time of the event, in milliseconds since the unix epoch */
  startTimestamp?: Maybe<Scalars['Int']>;
  /** Who is able to see the event */
  visibility?: Maybe<Visibility>;
  /** Whether this event should give a warning when a user attempts to check in more than once */
  warnRepeatedCheckins?: Maybe<Scalars['Boolean']>;
};

/** Represents a user checking into an event at a specific time */
export type EventCheckIn = {
  __typename?: 'EventCheckIn';
  /** Time the user checked in, in unix milliseconds */
  time: Scalars['Int'];
  /** The user who checked in to the event */
  user: User;
};

export enum EventsFilter {
  /** Returns all events that the user has permission to see */
  All = 'ALL',
  /** Returns only events owned by the user's group */
  Owned = 'OWNED'
}

/** Enumerations for common gender responses */
export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  PreferNotToSay = 'PREFER_NOT_TO_SAY'
}

/** Container for common gender responses and a free-text "other" field. */
export type GenderWithOther = {
  __typename?: 'GenderWithOther';
  /** User-provided selection for their gender. May be null is no selection is made. */
  gender?: Maybe<Gender>;
  /** User-provided 'other' text for their gender. */
  other?: Maybe<Scalars['String']>;
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
  /** Events this group owns, if any */
  ownedEvents?: Maybe<Array<Event>>;
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
  /** Adds a secondary ID to a `User`. For example, used to associate a unique NFC tag ID with a user. */
  addSecondaryIdForUser: User;
  /** Adds a user to the specified group, either by primary user ID or email */
  addUserToGroup?: Maybe<User>;
  /**
   * Checks a user into an event.
   *
   * The event is added to the user's `attendedEvents` list and their `eventScore`, if applicable.
   *
   * The user is added to the event's `attendees` list, as is a corresponding EventCheckIn to the
   * event's checkins list.
   */
  checkInUserToEvent: Event;
  /** Creates and returns a group with the specified name */
  createGroup: Group;
  /** Deletes events with the corresponding IDs. Returns the number of events deleted. */
  deleteEvents: Scalars['Int'];
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
  /**
   * Removes a user from an event if they've already checked in.
   *
   * The event is removed from the user's `attendedEvents` list and their `eventScore`, if applicable.
   *
   * The user is removed from the event's `attendees` list, as is the corresponding EventCheckIn in
   * the event's	checkins list.
   */
  removeUserFromEvent: Event;
  /** Removes a user from the specified group */
  removeUserFromGroup?: Maybe<User>;
  /**
   * Retrieves a signed read url for a zip file of resumes matching all of the provided filter criteria.
   *
   * This is implemented as a mutation, as it is expensive to call.
   */
  resumeDumpUrl?: Maybe<Scalars['String']>;
  /** Primary mutation for saving a user's application. */
  saveApplication: User;
  /** Sets an event's owner to the specified group. Returns the updated event. */
  setEventOwner: Event;
  /** Updates the specified group's roles to match those specified */
  setGroupRoles?: Maybe<Group>;
  /** Sets the `applicationStatus` field of the corresponding user(s) to the `applicationStatus` supplied as an argument. */
  setUserApplicationStatus: User;
  /**
   * Synchronizes events with the configured source of truth, for example, Google Calendar.
   *
   * This mutation creates DB entries for missing events as well as removes entries for events
   * that have been removed from the calendar. It returns the number of events updated.
   */
  syncEvents: Scalars['Int'];
};


export type MutationAddSecondaryIdForUserArgs = {
  secondaryId: Scalars['ID'];
  userId: Scalars['ID'];
};


export type MutationAddUserToGroupArgs = {
  groupId: Scalars['ID'];
  userId: Scalars['ID'];
  userIdType?: InputMaybe<IdType>;
};


export type MutationCheckInUserToEventArgs = {
  eventId: Scalars['ID'];
  userId: Scalars['ID'];
  userIdType?: InputMaybe<IdType>;
};


export type MutationCreateGroupArgs = {
  name: Scalars['String'];
};


export type MutationDeleteEventsArgs = {
  id: Array<Scalars['ID']>;
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


export type MutationRemoveUserFromEventArgs = {
  eventId: Scalars['ID'];
  userId: Scalars['ID'];
  userIdType?: InputMaybe<IdType>;
};


export type MutationRemoveUserFromGroupArgs = {
  groupId: Scalars['ID'];
  userId: Scalars['ID'];
  userIdType?: InputMaybe<IdType>;
};


export type MutationResumeDumpUrlArgs = {
  filterCriteria?: InputMaybe<UserFilterCriteria>;
};


export type MutationSaveApplicationArgs = {
  applicationField: Array<ApplicationField>;
  updateStatus?: InputMaybe<Scalars['Boolean']>;
};


export type MutationSetEventOwnerArgs = {
  eventId: Scalars['ID'];
  groupId: Scalars['ID'];
};


export type MutationSetGroupRolesArgs = {
  antiRoles: Array<Role>;
  groupId: Scalars['String'];
  roles: Array<Role>;
};


export type MutationSetUserApplicationStatusArgs = {
  applicationStatus: ApplicationStatus;
  userId: Array<Scalars['ID']>;
  userIdType?: InputMaybe<IdType>;
};

export type Query = {
  __typename?: 'Query';
  /** Returns an individual event based by ID */
  event?: Maybe<Event>;
  /** Returns list of events. */
  events: Array<Event>;
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


export type QueryEventArgs = {
  id: Scalars['ID'];
};


export type QueryEventsArgs = {
  after?: InputMaybe<Scalars['ID']>;
  filter?: InputMaybe<EventsFilter>;
  first?: InputMaybe<Scalars['Int']>;
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
 * Race, as a combination of the US Census bureau's definitions for race and ethnicity:
 * https://www.census.gov/topics/population/race/about.html
 */
export enum Race {
  AmericanIndianOrAlaskaNative = 'AMERICAN_INDIAN_OR_ALASKA_NATIVE',
  Asian = 'ASIAN',
  BlackOrAfricanAmerican = 'BLACK_OR_AFRICAN_AMERICAN',
  HispanicOrLatino = 'HISPANIC_OR_LATINO',
  NativeHawaiianPacificIslander = 'NATIVE_HAWAIIAN_PACIFIC_ISLANDER',
  White = 'WHITE'
}

/** Container for combination of [0,6] `Race` enum values as well as a free-text "other" field. */
export type RacesWithOther = {
  __typename?: 'RacesWithOther';
  /** User-provided 'other' text for their race. */
  other?: Maybe<Scalars['String']>;
  /** User-provided multiselect selections for their race. If no selections are made, will be empty array. */
  race: Array<Race>;
};

/**
 * Roles the user has. Each role confers permissions for a fine-grained action.
 *
 * Must be kept in sync with definitions in other subgraphs.
 */
export enum Role {
  /** User can attend events and is given a score for doing so */
  AttendEvents = 'ATTEND_EVENTS',
  /** User can check in any user to any event */
  CheckinUsersAllEvents = 'CHECKIN_USERS_ALL_EVENTS',
  /** User A can check in any user to an event owned by any group User A is a part of */
  CheckinUsersOwnedEvents = 'CHECKIN_USERS_OWNED_EVENTS',
  Hacker = 'HACKER',
  /** User can manage events, including their score, title, etc. */
  ManageEvents = 'MANAGE_EVENTS',
  Organizer = 'ORGANIZER',
  Sponsor = 'SPONSOR',
  SuperAdmin = 'SUPER_ADMIN',
  /** User can view list of hackers that have checked into any event */
  ViewCheckedInHackersAllEvents = 'VIEW_CHECKED_IN_HACKERS_ALL_EVENTS',
  /** User A can view users that have checked into an event owned by any group User A is a part of */
  ViewCheckedInHackersOwnedEvents = 'VIEW_CHECKED_IN_HACKERS_OWNED_EVENTS',
  Volunteer = 'VOLUNTEER'
}

export enum ShirtSize {
  L = 'L',
  M = 'M',
  NoShirt = 'NO_SHIRT',
  S = 'S',
  WomensL = 'WOMENS_L',
  WomensM = 'WOMENS_M',
  WomensS = 'WOMENS_S',
  WomensXl = 'WOMENS_XL',
  WomensXs = 'WOMENS_XS',
  WomensXxl = 'WOMENS_XXL',
  Xl = 'XL',
  Xs = 'XS',
  Xxl = 'XXL'
}

/**
 * Logical representation of a user. This type is extended with domain-specific
 * fields in various subgraphs.
 */
export type User = {
  __typename?: 'User';
  /** Application fields from the hacker's application, if filled out. */
  application?: Maybe<Application>;
  /** Events the user has attended */
  attendedEvents?: Maybe<Array<Event>>;
  /** Time the user was created, in milliseconds since the unix epoch. Float is required for millisecond precision. */
  createdAt?: Maybe<Scalars['Float']>;
  /** Email of the user */
  email?: Maybe<Scalars['String']>;
  /** Whether the user has unsubscribed from emails from VandyHacks. If so, this user should not be sent further emails */
  emailUnsubscribed?: Maybe<Scalars['Boolean']>;
  /** Event score for all of the events the user has attended */
  eventScore?: Maybe<Scalars['Int']>;
  /** Group the user is a part of. Allows a user to own events and delegate their group's permissions to other users. */
  groups?: Maybe<Array<Group>>;
  /** User's unique identifier */
  id: Scalars['ID'];
  /** Computes the effective roles granted to a user, accounting for group roles and anti-roles */
  roles?: Maybe<Array<Role>>;
  /** Secondary IDs for a user, such as NFC tag IDs */
  secondaryIds?: Maybe<Array<Scalars['ID']>>;
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

export enum Visibility {
  /** Only visible to the Group that owns the event */
  Internal = 'INTERNAL',
  /** Visible to all users */
  Public = 'PUBLIC'
}

/** Whether or not the hacker elected to volunteer to be available for helping during the hackathon. */
export enum VolunteerOption {
  OptIn = 'OPT_IN',
  OptOut = 'OPT_OUT'
}
