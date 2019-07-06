import { createContext, ReactNode } from 'react';

export const ActionButtonContext = createContext<{
	ActionButton?: ReactNode;
	update?: (n?: ReactNode) => void;
}>({});

export default ActionButtonContext;
