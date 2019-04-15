import { Resolver, Query, Arg, Mutation } from 'type-graphql';

import { TeamModel } from '../models/Team';
import { HackerModel } from '../models/Hacker';
import CONSTANTS from '../../common/constants.json';
import { UserModel } from '../models/User';
import AuthLevel from '../enums/AuthLevel';

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

// Copyright (c) 2019 Vanderbilt University
