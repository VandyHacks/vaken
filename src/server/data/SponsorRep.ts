import 'reflect-metadata';
import { Field, ObjectType } from 'type-graphql';

import User from './User';

@ObjectType({ description: 'DTO for a Vaken sponsor rep' })
export default class SponsorRep extends User {
	/**
	 *  names of sponsor companies this rep belongs to
	 */
	@Field(() => [String])
	public sponsors!: string[];

	@Field()
	public title!: string;

	@Field()
	public leadRep!: boolean;
}
