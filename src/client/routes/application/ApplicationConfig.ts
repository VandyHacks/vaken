import React from 'react';

export interface AppSection {
	fields: AppField[];
	category: string;
	title: string;
}

export interface AppField {
	fieldName: string;
	placeholder?: string;
	required?: boolean;
	title: string;
	validation?: string;
	note?: string;
	input: string;
}
