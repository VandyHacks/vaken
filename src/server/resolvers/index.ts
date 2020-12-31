import { AuthenticationError } from 'apollo-server-express';
import { UserType } from '../generated/graphql';
import Context from '../context';
import { Hacker } from './HackerResolver';
import { ApplicationField } from './ApplicationFieldResolver';
import { Event } from './EventResolver';
import { EventCheckIn } from './EventCheckInResolver';
import { Company } from './CompanyResolver';
import { CustomResolvers } from './types';
import { Volunteer } from './VolunteerResolver';
import { Login } from './LoginResolver';
import { Mentor } from './MentorResolver';
import { Organizer } from './OrganizerResolver';
import { Query } from './QueryResolvers';
import { Sponsor } from './SponsorResolver';
import { Tier } from './TierResolver';
import { Team } from './TeamResolver';
import { Shift } from './ShiftResolver';
import { Mutation } from './MutationResolver';

// TODO: Cannot import frontend files so this is ugly workaround. Fix this.
const requiredFields = [
	'firstName',
	'lastName',
	// 'shirtSize',
	'gender',
	'phoneNumber',
	'dateOfBirth',
	'school',
	'major',
	'gradYear',
	'race',
	// 'favArtPiece',
	// 'essay1',
	// 'volunteer',
	'resume',
	'codeOfConduct',
	'infoSharingConsent',
];

export const resolvers: CustomResolvers<Context> = {
	/**
	 * These resolvers are for querying fields
	 */
	ApplicationField,
	Event,
	EventCheckIn,
	Company,
	Tier,
	Hacker,
	Volunteer,
	Login,
	Mentor,
	/**
	 * These mutations modify data
	 * Each may contain authentication checks as well
	 */
	Mutation,
	Organizer,
	Query,
	Shift,
	Sponsor,
	Team,
	User: {
		__resolveType: user => {
			switch (user.userType) {
				case UserType.Hacker:
					return 'Hacker';
				case UserType.Organizer:
					return 'Organizer';
				case UserType.Sponsor:
					return 'Sponsor';
				case UserType.Volunteer:
					return 'Volunteer';
				default:
					throw new AuthenticationError(`cannot decode UserType "${user.userType}`);
			}
		},
	},
};

export default resolvers;
