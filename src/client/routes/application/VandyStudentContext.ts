import { createContext } from 'react';

export const VandyStudentContext = createContext<{
	vandyStatus?: number;
	vandyStatusDispatch?: (value: boolean) => void;
}>({});
