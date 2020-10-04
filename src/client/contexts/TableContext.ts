import { createContext } from 'react';
import { SortDirectionType } from 'react-virtualized';
import { Draft } from 'immer';
import Fuse from 'fuse.js';
import { HackersQuery } from '../generated/graphql';
import { QueriedHacker } from '../routes/manage/HackerTableTypes';

export interface Option {
	label: string;
	value: keyof HackersQuery['hackers'][0];
}

// define thresholds for fuzzy searching
export const fuseOpts = {
	caseSensitive: false,
	distance: 100,
	findAllMatches: true,
	location: 0,
	shouldSort: true,
	threshold: 0.1,
	tokenize: true,
	matchAllTokens: true,
};

export interface SearchCriterion {
	fuzzySearch: boolean;
	searchValue: string;
	selectedColumns: Option[];
}

export class SearchCriteria {
	static Create(): SearchCriterion {
		return {
			fuzzySearch: false,
			searchValue: '',
			selectedColumns: [{ label: 'First Name', value: 'firstName' }] as Option[],
		};
	}

	/**
	 * Filters out items that don't match the filter parameters in this class.3
	 * @param fields Array of results on which to operate in-place
	 */
	static filter(
		fields: HackersQuery['hackers'],
		criterion: SearchCriterion
	): HackersQuery['hackers'] {
		// filter and sort data
		if (criterion.searchValue.trim() !== '' && criterion.fuzzySearch) {
			// Fuzzy search selected columns
			return new Fuse(fields, {
				keys: criterion.selectedColumns.map((col: Option) => col.value) as (keyof QueriedHacker)[],
				...fuseOpts,
			})
				.search(criterion.searchValue)
				.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
				.map(result => result.item);
		}
		if (criterion.searchValue.trim() !== '') {
			// filter based on regex
			const regex = new RegExp(criterion.searchValue, 'i');
			// ternary for case when going for empty multi-select to empty single-select
			return criterion.selectedColumns.length > 0
				? fields.filter(hacker => regex.test(`${hacker[criterion.selectedColumns[0].value]}`))
				: [];
		}

		return fields;
	}
}

export const defaultTableState = {
	searchCriteria: [SearchCriteria.Create()],
	hasSelection: false,
	nfcValue: '',
	searchValue: '',
	selectAll: false,
	selectedRowsIds: [] as string[],
	sortBy: undefined as keyof HackersQuery['hackers'][0] | undefined,
	sortDirection: 'ASC' as SortDirectionType | undefined,
};

export interface TableCtxI {
	state: typeof defaultTableState;
	update: (f: (draft: Draft<typeof defaultTableState>) => void | typeof defaultTableState) => void;
}

export const TableContext = createContext<TableCtxI>({
	state: defaultTableState,
	update: () => {
		// Do nothing
	},
});
