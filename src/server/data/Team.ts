import 'reflect-metadata';
import { Field, ObjectType } from 'type-graphql';

import Hacker from './Hacker';

@ObjectType({ description: 'DTO for a Vaken Team' })
export default class Team {
	@Field()
	public teamName!: string;

	@Field(() => [Hacker])
	public teamMembers!: Hacker[];

	@Field()
	public size: number = 0;
}
