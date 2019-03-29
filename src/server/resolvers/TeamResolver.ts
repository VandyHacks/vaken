import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { User } from '../data/User';
import { Team } from '../data/Team';

import { userModel } from '../models/User';
import { teamModel } from '../models/Team';

@Resolver(() => Team)
class TeamResolver {
	/**
	 * @param {string} teamName - name of the team to
	 * @returns {Promise<void>} Promise to Team is created or undefined if team existed
	 */
	@Mutation(() => Team, {
		description: 'Create a Team',
	})
	public async createTeam(@Arg('teamName') teamName: string): Promise<void> {
		const team = await teamModel.findOne({ teamName: teamName });

		// If a team already exists, throw an error
		if (team) {
			throw new Error('Team already exists!');
		}

		// Create a team, throwing an exception if that fails
		try {
			await teamModel.create({ teamMembers: [], teamName: teamName });
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @param {string} email - email address of the user to add to a team
	 * @param {string} teamName - name of the team to which to add the user
	 * @returns {Status} new status of user or null if the hacker doesn't exist
	 */
	@Mutation(() => Team, {
		description: 'Add a Hacker to a team',
	})
	public async addHackerToTeam(
		@Arg('email', { nullable: false }) email: string,
		@Arg('teamName') teamName: string
	) {
		const team = await teamModel.findOne({ teamName: teamName });

		if (!team) {
			// Create team, add hacker to it
		} else if (team.teamMembers.length === teamModel.MAX_SIZE) {
			// Don't add, return error
		} else {
			// Add to team, return success
		}
	}

	/**
	 * @param {string} email - email address of the user to add to a team
	 * @param {string} teamName - name of the team to which to add the user
	 * @returns {Status} new status of user or null if the hacker doesn't exist
	 */
	@Mutation(() => Team, {
		description: 'Remove a Hacker from a team',
	})
	public async removeHackerFromTeam(
		@Arg('email', { nullable: false }) email: string,
		@Arg('teamName') teamName: string
	) {
		const team = await teamModel.findOne({ teamName: teamName });

		if (!team) {
			// Create team, add hacker to it
		} else if (team.teamMembers.length === teamModel.MAX_SIZE) {
			// Don't add, return error
		} else {
			// Add to team, return success
		}
	}

	/**
	 * @param {string} teamName - email address of a particular user
	 * @returns {number} Size of the team
	 */
	@Query(() => User, {
		description: 'Return the size of a Team',
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
