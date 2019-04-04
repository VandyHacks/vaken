import { Resolver, Query, Arg } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { Mentor } from '../data/Mentor';

@Resolver(of => Mentor)
class MentorResolver {}

export default MentorResolver;

// Copyright (c) 2019 Vanderbilt University
