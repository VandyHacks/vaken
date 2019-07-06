// Context must be outside of `index.ts` for it to be importable by the resolvers.

import { Models } from './models';
import { UserDbInterface } from './generated/graphql';

export default interface Context {
	models: Models;
	user?: UserDbInterface;
}
