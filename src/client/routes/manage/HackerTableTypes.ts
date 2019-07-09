import { SortDirectionType } from 'react-virtualized';

import { HackersQuery } from '../../generated/graphql';

type ArrayType<T> = T extends (infer U)[] ? U : never;
export type QueriedHacker = ArrayType<HackersQuery['hackers']>;

export interface SortFnProps {
	sortBy?: keyof QueriedHacker;
	sortDirection?: SortDirectionType;
}

export default {
	QueriedHacker,
	SortFnProps,
};
