import 'reflect-metadata';
import { ObjectType, Field } from 'type-graphql';

@ObjectType({ description: 'DTO for a count of hackers for a school' })
export default class SchoolCounts {
	@Field()
	public school!: string;

	@Field()
	public counts: number = 0;
}
