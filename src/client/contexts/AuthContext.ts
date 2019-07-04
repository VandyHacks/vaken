import { createContext } from 'react';
import { MeQuery, UserType } from '../generated/graphql';

export const AuthContext = createContext<MeQuery['me']>({
	firstName: '',
	id: '',
	lastName: '',
	userType: UserType.Hacker,
});

export default AuthContext;
