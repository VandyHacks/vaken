import 'reflect-metadata';
import { Field, ObjectType } from 'type-graphql';

import User from './User';
import Sponsor from './Sponsor';

@ObjectType({ description: 'DTO for a Vaken sponsor rep' })
export default class SponsorRep extends User {
	@Field(() => [Sponsor])
	public sponsors!: [Sponsor];

	@Field()
	public title!: string;

	@Field()
	public leadRep!: boolean;
}
