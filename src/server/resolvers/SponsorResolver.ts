import { Resolver, Query, Arg } from 'type-graphql';
import { plainToClass } from 'class-transformer';

import { Sponsor } from '../data/Sponsor';

@Resolver(of => Sponsor)
class SponsorResolver {}

export default SponsorResolver;
