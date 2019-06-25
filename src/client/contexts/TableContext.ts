import { createContext } from 'react';
import { SortDirectionType } from 'react-virtualized';
import { Update } from 'use-immer';

export enum HackerStatus {
	Created,
	Verified,
	Started,
	Submitted,
	Accepted,
	Confirmed,
	Rejected,
}

export const columnOptions = [
	{ label: 'First Name', value: 'firstName' },
	{ label: 'Last Name', value: 'lastName' },
	{ label: 'Email Address', value: 'email' },
	{ label: 'School', value: 'school' },
	{ label: 'Graduation Year', value: 'gradYear' },
	{ label: 'Status', value: 'status' },
	{ label: 'Reimbursement', value: 'needsReimbursment' },
];

export interface Hacker {
	[index: string]: string | HackerStatus | number | boolean | undefined;
	email: string;
	firstName: string;
	gradYear?: number;
	lastName: string;
	needsReimbursement?: boolean;
	school?: string;
	status: HackerStatus;
}

export interface Option {
	label: string;
	value: string;
}
export interface TableState {
	fuzzySearch: boolean;
	hasSelection: boolean;
	searchValue: string;
	selectAll: boolean;
	selectedColumns: Option[];
	selectedRowsEmails: string[];
	sortBy?: string;
	sortDirection?: SortDirectionType;
}

export const defaultTableState = {
	fuzzySearch: true,
	hasSelection: false,
	searchValue: '',
	selectAll: false,
	selectedColumns: [columnOptions[0]],
	selectedRowsEmails: [],
};

export interface TableCtxI {
	state: TableState;
	update: Update<TableState>;
}

export const TableContext = createContext<TableCtxI>({
	state: defaultTableState,
	update: () => {},
});
