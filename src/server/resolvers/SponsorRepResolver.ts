import { Resolver } from 'type-graphql';

import { SponsorRep } from '../data/SponsorRep';

@Resolver(() => SponsorRep)
class SponsorRepResolver {}

export default SponsorRepResolver;
