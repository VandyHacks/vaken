import { Resolver } from 'type-graphql';

import { Mentor } from '../data/Mentor';

@Resolver(() => Mentor)
class MentorResolver {}

export default MentorResolver;

// Copyright (c) 2019 Vanderbilt University
