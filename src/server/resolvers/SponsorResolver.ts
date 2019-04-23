import { Resolver } from 'type-graphql';

import { Sponsor } from '../data/Sponsor';

@Resolver(() => Sponsor)
class SponsorResolver {}

export default SponsorResolver;
