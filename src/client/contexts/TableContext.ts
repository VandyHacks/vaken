import React, { createContext } from 'react';
import { SortDirectionType } from 'react-virtualized';

export enum HackerStatus {
	created = 'created',
	verified = 'verified',
	started = 'started',
	submitted = 'submitted',
	accepted = 'accepted',
	confirmed = 'confirmed',
	rejected = 'rejected',
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

// TODO(alan): convert status from hackerData JSON from types string to HackerStatus and remove union type
export interface Hacker {
	firstName: string;
	lastName: string;
	email: string;
	gradYear?: number;
	school?: string;
	status: HackerStatus | string;
	needsReimbursement?: boolean;
}

export interface Option {
	label: string;
	value: string;
}

export class Table {
    constructor(data: Hacker[]) {
        this.sortedData = data;
        this.unsortedData = data;
    }

    public sortByState: string | null = null;

    public sortDirectionState: SortDirectionType | null = null;

    public sortedData: Hacker[];

    public unsortedData: Hacker[];

    public searchValue: string = "";

    public selectedColumns?: Option[] = [columnOptions[0]];

    public selectAll: boolean = false;

    public hasSelection: boolean = false;

    public selectedRowsEmails: string[] = [];
}

// export const TableContext = (data: Hacker[]) => createContext<Table>(new Table([data]));
export const TableContext = createContext<Table>(new Table([]));