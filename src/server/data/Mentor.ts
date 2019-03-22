import 'reflect-metadata';
import { Field, ObjectType } from 'type-graphql';

import { User } from './User';

@ObjectType({ description: 'DTO for a Vaken mentor' })
export class Mentor extends User {
	@Field(type => [String])
	shifts!: [string];

	@Field(type => [String])
	skills!: [string];
}

// Copyright (c) 2019 Vanderbilt University
