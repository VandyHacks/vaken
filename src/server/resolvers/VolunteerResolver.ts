import Context from '../context';
import { VolunteerResolvers, UserType } from '../generated/graphql';
import { Hacker } from './HackerResolver';

export const Volunteer: VolunteerResolvers<Context> = {
	...Hacker,
	userType: () => UserType.Volunteer,
};
