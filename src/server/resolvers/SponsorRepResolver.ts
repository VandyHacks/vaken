import { Resolver, Query, Arg } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { SponsorRep } from '../data/SponsorRep';

@Resolver(of => SponsorRep)
class SponsorRepResolver {}

export default SponsorRepResolver;
