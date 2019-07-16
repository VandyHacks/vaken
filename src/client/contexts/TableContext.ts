import { createContext } from 'react';
import { SortDirectionType } from 'react-virtualized';
import { Update } from 'use-immer';
import { HackersQuery } from '../generated/graphql';

export interface Option {
	label: string;
	value: keyof HackersQuery['hackers'][0];
}

export const defaultTableState = {
	fuzzySearch: true,
	hasSelection: false,
	searchValue: '',
	selectAll: false,
	selectedColumns: [{ label: 'First Name', value: 'firstName' }] as Option[],
	selectedRowsIds: [] as string[],
	sortBy: undefined as keyof HackersQuery['hackers'][0] | undefined,
	sortDirection: 'ASC' as SortDirectionType | undefined,
};

export interface TableCtxI {
	state: typeof defaultTableState;
	update: Update<typeof defaultTableState>;
}

export const TableContext = createContext<TableCtxI>({
	state: defaultTableState,
	update: () => {},
});
