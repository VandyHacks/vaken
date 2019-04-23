import 'reflect-metadata';
import { Field, ObjectType } from 'type-graphql';

import User from './User';

@ObjectType({ description: 'DTO for a Vaken mentor' })
export class Mentor extends User {
	@Field(() => [String])
	public shifts!: string[];

	@Field(() => [String])
	public skills!: string[];
}

export default Mentor;
