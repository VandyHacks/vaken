import { Resolver, Query, Arg } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { Organizer } from '../data/Organizer';

@Resolver(of => Organizer)
class OrganizerResolver {}

export default OrganizerResolver;

// Copyright (c) 2019 Vanderbilt University
