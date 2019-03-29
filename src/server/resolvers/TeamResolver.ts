import { Resolver, Query, Arg } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { User } from '../data/User';
import { Team } from '../data/Team';

import { userModel } from '../models/User';
import { teamModel } from '../models/Team';

@Resolver(() => Team)
class TeamResolver {
	/**
	 * @param {string} teamName - email address of a particular user
	 * @returns {number} Size of the team
	 */
	@Query(() => User, {
		description: 'Return a single User corresponding to a known email address',
		nullable: true,
	})
	public async getTeamSize(@Arg('teamName') teamName: string): Promise<number | undefined> {
		const team = await teamModel.findOne({ teamName: teamName });
		if (!team) {
			return undefined;
		} else {
			return team.teamMembers.length;
		}
	}
}

export default TeamResolver;
