import React, { createContext } from 'react';

export const LoginContext = createContext<{
	state: boolean;
	update: (b: boolean) => void;
}>({ state: false, update: () => {} });

export default LoginContext;
