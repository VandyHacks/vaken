import { createContext } from 'react';
import { MeQuery, UserType } from '../generated/graphql';

export const AuthContext = createContext<NonNullable<MeQuery['me']>>({
	email: '',
	firstName: '',
	id: '',
	lastName: '',
	userType: UserType.Hacker,
});

export default AuthContext;
