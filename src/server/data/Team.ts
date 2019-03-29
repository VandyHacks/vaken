import 'reflect-metadata';
import { Field, ObjectType } from 'type-graphql';

import Hacker from './Hacker';

@ObjectType({ description: 'DTO for a Vaken Team' })
export class Team {
	public TEAM_SIZE = 4;

	@Field()
	public teamName!: string;

	@Field()
	public teamMembers!: [Hacker];
}

export default Team;

// Copyright (c) 2019 Vanderbilt University
