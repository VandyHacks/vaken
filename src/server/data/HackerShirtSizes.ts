import 'reflect-metadata';
import { ObjectType, Field } from 'type-graphql';

import ShirtSize from '../enums/ShirtSize';

@ObjectType({ description: 'DTO for a count of hacker shirt sizes' })
export class HackerShirtSizes {
	@Field()
	public [ShirtSize.UXS]: number = 0;

	@Field()
	public [ShirtSize.US]: number = 0;

	@Field()
	public [ShirtSize.UM]: number = 0;

	@Field()
	public [ShirtSize.UL]: number = 0;

	@Field()
	public [ShirtSize.UXL]: number = 0;

	@Field()
	public [ShirtSize.UXXL]: number = 0;

	@Field()
	public [ShirtSize.WS]: number = 0;

	@Field()
	public [ShirtSize.WM]: number = 0;

	@Field()
	public [ShirtSize.WL]: number = 0;

	@Field()
	public [ShirtSize.WXL]: number = 0;

	@Field()
	public [ShirtSize.WXXL]: number = 0;

	@Field()
	public UNKNOWN: number = 0;
}

export default HackerShirtSizes;

// Copyright (c) 2019 Vanderbilt University
