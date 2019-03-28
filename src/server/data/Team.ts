import 'reflect-metadata';
import { Field, ObjectType } from 'type-graphql';

import Hacker from './Hacker';

@ObjectType({ description: 'DTO for a Vaken Team' })
class Team {
	@Field()
	public name!: string;

	@Field()
	public members!: [Hacker];
}

export default Team;

// Copyright (c) 2019 Vanderbilt University
