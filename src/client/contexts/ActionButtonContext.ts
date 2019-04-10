import { createContext } from 'react';

export const ActionButtonContext = createContext<{
	ActionButton?: JSX.Element;
	update?: (n?: JSX.Element) => void;
}>({});

export default ActionButtonContext;
