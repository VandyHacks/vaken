import { gql } from 'apollo-boost';

export const GET_TEAM = gql`
	query HackerTeam($email: String!) {
		hacker(email: $email) {
			teamName
		}
	}
`;

export const LEAVE_TEAM = gql`
	mutation LeaveTeam($email: String!) {
		leaveTeam(email: $email)
	}
`;

export const JOIN_TEAM = gql`
	mutation JoinTeam($email: String!, $teamName: String!) {
		joinTeam(email: $email, teamName: $teamName)
	}
`;
