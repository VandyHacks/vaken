import { Resolver } from 'type-graphql';

import { Organizer } from '../data/Organizer';

@Resolver(() => Organizer)
class OrganizerResolver {}

export default OrganizerResolver;
