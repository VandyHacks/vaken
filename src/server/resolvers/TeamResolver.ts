import { Resolver, Query, Arg, Mutation } from 'type-graphql';

import { teamModel } from '../models/Team';
import { HackerModel } from '../models/Hacker';
import CONSTANTS from '../../common/constants.json';

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
				await teamModel.create({ size: 1, teamMembers: [{ _id: hacker._id }], teamName });
			} catch (err) {
				throw new Error('Team could not be created!');
			}
		} else {
			// Check if the user is already part of the team
			if (team.teamMembers.indexOf(hacker._id) != -1) {
				throw new Error('Hacker is already a part of this team!');
			}

			// Check if the team is full
			if (team.size === CONSTANTS.MAX_TEAM_SIZE) {
				throw new Error('This team is already full!');
			}

			// Add the hacker to the team
			try {
				await teamModel.updateOne(
					{ teamName },
					{ $push: { teamMembers: { _id: hacker._id } }, $set: { size: team.size + 1 } }
				);
			} catch (err) {
				throw new Error('Hacker could not be added to team!');
			}
		}

		// Update the hacker's team
		try {
			await HackerModel.updateOne({ email }, { $set: { teamName: teamName } });
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
		@Arg('email', { nullable: false }) email: string
	): Promise<boolean> {
		// Ensure the team and hacker are in a valid state
		const hacker = await HackerModel.findOne({ email });

		// If the hacker doesn't exist, throw an error
		if (!hacker) {
			throw new Error('Hacker does not exist!');
		}

		const team = await teamModel.findOne({ teamName: hacker.teamName });

		if (!team) {
			throw new Error('Team does not exist!');
		} else if (team.teamMembers.indexOf(hacker._id) === -1) {
			throw new Error('Hacker is not on this Team!');
		}

		// Remove hacker from the team
		try {
			const updatedTeam = await teamModel.findOneAndUpdate(
				{ teamName: hacker.teamName },
				{ $pull: { teamMembers: hacker._id }, $set: { size: team.size - 1 } },
				{ new: true }
			);

			// Remove teamName from Hacker's profile
			await HackerModel.updateOne({ email }, { $set: { teamName: '' } });

			// If the team is now empty, delete it
			if (updatedTeam && updatedTeam.size === 0) {
				try {
					// Doesn't currently work for some reason
					// We are able to reach this part of the code
					await teamModel.deleteOne({ teamname: hacker.teamName });
				} catch (err) {
					throw new Error('Now empty team could not be deleted!');
				}
			}
		} catch (err) {
			throw new Error('Hacker could not be removed from team!');
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
