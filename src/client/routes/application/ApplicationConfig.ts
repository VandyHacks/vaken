import React from 'react';

export interface AppSection {
	fields: AppField[];
	name: string;
	title: string;
}

export interface AppField {
	name: string;
	placeholder?: string;
	required?: boolean;
	title: string;
	validation?: string;
	note?: string;
	input: string;
}
