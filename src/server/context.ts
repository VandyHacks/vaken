import { Models } from './models';
import { UserDbInterface } from './generated/graphql';

export default interface Context {
	models: Models;
	user?: UserDbInterface;
}
