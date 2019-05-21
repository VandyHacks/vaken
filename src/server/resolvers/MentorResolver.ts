import { Resolver } from 'type-graphql';

import Mentor from '../data/Mentor';

@Resolver(() => Mentor)
class MentorResolver {}

export default MentorResolver;
