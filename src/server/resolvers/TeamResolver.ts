import { Resolver, Query, Arg } from 'type-graphql';

import { TeamModel } from '../models/Team';

@Resolver()
class TeamResolver {
	/**
	 * @param {string} teamName - email address of a particular user
	 * @returns {number} Size of the team
	 */
	@Query(() => Number, {
		description: 'Return the size of a Team',
		nullable: true,
	})
	public static async getTeamSize(@Arg('teamName') teamName: string): Promise<number> {
		const team = await TeamModel.findOne({ teamName });

		if (!team) {
			throw new Error('Team does not exist!');
		} else {
			return team.size;
		}
	}
}

export default TeamResolver;
