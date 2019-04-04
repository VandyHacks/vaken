import { Resolver, Query, Arg, Mutation } from 'type-graphql';

import { teamModel } from '../models/Team';
import { HackerModel } from '../models/Hacker';

@Resolver()
class TeamResolver {
	/**
	 * @param {string} email - email address of the user to add to a team
	 * @param {string} teamName - name of the team to which to add the user
	 * @returns {boolean} true if successful
	 * @throws {Error} if unsuccessful
	 */
	@Mutation(() => Boolean, {
		description: 'Add a Hacker to a team',
	})
	public static async addHackerToTeam(
		@Arg('email', { nullable: false }) email: string,
		@Arg('teamName') teamName: string
	): Promise<boolean> {
		// Make sure the team and hacker exist
		const team = await teamModel.findOne({ teamName });
		const hacker = await HackerModel.findOne({ email });

		// If the hacker doesn't exist, throw an error
		if (!hacker) {
			throw new Error('Hacker does not exist!');
		}

		// If the team doesn't exist, create it
		if (!team) {
			try {
				await teamModel.create({ teamMembers: [], teamName });
			} catch (err) {
				throw new Error('Team could not be created!');
			}
		}

		// Add the hacker to the team
		try {
			teamModel.updateOne({ teamName }, { $push: { teamMembers: hacker } }).exec();
		} catch (err) {
			throw new Error('Hacker could not be added to team!');
		}

		// Update the hacker's team
		try {
			hacker.teamName = teamName;
			hacker.save();
		} catch (err) {
			throw new Error('Hacker team could not be updated!');
		}

		// Upon success, return true
		return true;
	}

	/**
	 * @param {string} email - email address of the user to add to a team
	 * @param {string} teamName - name of the team to which to add the user
	 * @returns {boolean} true if successful
	 * @throws {Error} if unsuccessful
	 */
	@Mutation(() => Boolean, {
		description: 'Remove a Hacker from a team',
	})
	public static async removeHackerFromTeam(
		@Arg('email', { nullable: false }) email: string,
		@Arg('teamName') teamName: string
	): Promise<boolean> {
		// Ensure the team and hacker are in a valid state
		const team = await teamModel.findOne({ teamName });
		const hacker = await HackerModel.findOne({ email });

		if (!team) {
			throw new Error('Team does not exist!');
		} else if (!hacker) {
			throw new Error('Hacker does not exist!');
		} else if (!team.teamMembers.includes(hacker)) {
			throw new Error('Hacker is not on this Team!');
		}

		// Remove hacker from the team
		try {
			teamModel.findOneAndUpdate({ teamName }, { $pull: { teamMembers: hacker } });

			// Remove teamName from Hacker's profile
			hacker.teamName = '';
			hacker.save();
		} catch (err) {
			throw new Error('Hacker could not be removed from team!');
		}

		// If the team is now empty, delete it
		if (teamModel.size === 0) {
			try {
				teamModel.findOneAndDelete({ teamName });
			} catch (err) {
				throw new Error('Now empty team could not be deleted!');
			}
		}

		// Upon success, return true
		return true;
	}

	/**
	 * @param {string} teamName - email address of a particular user
	 * @returns {number} Size of the team
	 */
	@Query(() => Number, {
		description: 'Return the size of a Team',
		nullable: true,
	})
	public static async getTeamSize(@Arg('teamName') teamName: string): Promise<number> {
		const team = await teamModel.findOne({ teamName });

		if (!team) {
			throw new Error('Team does not exist!');
		} else {
			return team.size;
		}
	}
}

export default TeamResolver;

// Copyright (c) 2019 Vanderbilt University
