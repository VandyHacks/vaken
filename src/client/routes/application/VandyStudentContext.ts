import { createContext } from 'react';

export const VandyStudentContext = createContext<{
	vandyStatus?: number;
	setVandyStatus?: (value: boolean) => void;
}>({});
