import React, { createContext } from 'react';
import { User } from '../../common/models/User';

export const AuthContext = createContext<User>(new User());

export default AuthContext;