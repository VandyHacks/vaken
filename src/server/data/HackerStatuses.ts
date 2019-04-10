import 'reflect-metadata';
import { ObjectType, Field } from 'type-graphql';

import Status from '../enums/Status';

@ObjectType({ description: 'DTO for a count of hacker statuses' })
export class HackerStatuses {
	@Field()
	public [Status.Created]: number = 0;

	@Field()
	public [Status.Verified]: number = 0;

	@Field()
	public [Status.Started]: number = 0;

	@Field()
	public [Status.Submitted]: number = 0;

	@Field()
	public [Status.Accepted]: number = 0;

	@Field()
	public [Status.Confirmed]: number = 0;

	@Field()
	public [Status.Rejected]: number = 0;
}

export default HackerStatuses;

// Copyright (c) 2019 Vanderbilt University
