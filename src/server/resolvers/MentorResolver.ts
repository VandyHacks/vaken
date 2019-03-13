import { Resolver, Query, Arg } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { Mentor } from '../data/Mentor';

@Resolver(of => Mentor)
export class MentorResolver {}
