import { Resolver, Query, Arg } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { Organizer } from '../data/Organizer';

@Resolver(of => Organizer)
export class OrganizerResolver {}
