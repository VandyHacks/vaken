import Context from '../context';
import { LoginResolvers, UserType, LoginProvider } from '../generated/graphql';
import { toEnum } from './helpers';

export const Login: LoginResolvers<Context> = {
	createdAt: async login => (await login).createdAt.getTime(),
	provider: async login => toEnum(LoginProvider)((await login).provider),
	token: async login => (await login).token,
	userType: async login => (await login).userType as UserType,
};
