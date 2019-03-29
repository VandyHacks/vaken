import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { User } from '../data/User';
import { Team } from '../data/Team';

import { userModel } from '../models/User';
import { teamModel } from '../models/Team';
import { hackerModel } from '../models/Hacker';

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
	): Promise<void> {
		const team = await teamModel.findOne({ teamName: teamName });

		if (!team) {
			// Create the team
			this.createTeam(teamName);

			// Find the Hacker associated with the provided email
			let hacker = hackerModel.findOne({ email: email });

			// Add the Hacker to the team
			teamModel.findOneAndUpdate(
				{ teamName: teamName },
				{ $push: { teamMembers: hacker } },
				{ new: true }
			);
		} else if (team.teamMembers.length === teamModel.MAX_SIZE) {
			throw new Error('Team limit reached!');
		} else {
			// Find the Hacker associated with the provided email
			let hacker = hackerModel.findOne({ email: email });

			// Add the Hacker to the team
			teamModel.findOneAndUpdate(
				{ teamName: teamName },
				{ $push: { teamMembers: hacker } },
				{ new: true }
			);
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
		const hacker = await hackerModel.findOne({ email: email });

		if (!team) {
			throw new Error('Team does not exist!');
		} else if (!hacker) {
			throw new Error('Hacker does not exist!');
		} else if (!team.teamMembers.includes(hacker)) {
			throw new Error('Hacker is not on this Team!');
		} else {
			teamModel.findOneAndUpdate({ teamName: teamName }, { $pull: { teamMembers: hacker } });
		}

		// If the team is now empty, delete it
		if (team.teamMembers.length === team.MIN_SIZE) {
			teamModel.findOneAndDelete({ teamName: teamName });
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
