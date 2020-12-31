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

export const resolvers: CustomResolvers<Context> = {
	ApplicationField,
	Event,
	EventCheckIn,
	Company,
	Tier,
	Hacker,
	Volunteer,
	Login,
	Mentor,
	Mutation,
	Organizer,
	Query,
	Shift,
	Sponsor,
	Team,
	// figures out what type of User is logged in
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
