import { createContext } from 'react';
import { SortDirectionType } from 'react-virtualized';
import { Update } from 'use-immer';

export enum HackerStatus {
	Created = 'Created',
	Verified = 'Verified',
	Started = 'Started',
	Submitted = 'Submitted',
	Accepted = 'Accepted',
	Confirmed = 'Confirmed',
	Rejected = 'Rejected',
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
	firstName: string;
	lastName: string;
	email: string;
	gradYear?: number;
	school?: string;
	status: HackerStatus;
	needsReimbursement?: boolean;
}

export interface Option {
	label: string;
	value: string;
}
export interface TableState {
	fuzzySearch: boolean;
	sortBy?: string;
	sortDirection?: SortDirectionType;
	searchValue: string;
	selectedColumns: Option[];
	selectAll: boolean;
	hasSelection: boolean;
	selectedRowsEmails: string[];
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
