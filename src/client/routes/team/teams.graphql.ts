import { gql } from 'apollo-boost';

export const GET_TEAM = gql`
	input GetTeamInput {}

	mutation team {}
`;

export const LEAVE_TEAM = gql`
	input LeaveTeamInput {
		user: ID!
	}

	mutation LeaveTeam($input: LeaveTeamInput!) {
		leaveTeam(input: $input)
	}
`;

export const JOIN_TEAM = gql`
	input JoinTeamInput {
		user: ID!
		team: ID!
	}

	mutation JoinTeam($input: JoinTeamInput) {
		joinTeam(input: $input)
	}
`;
