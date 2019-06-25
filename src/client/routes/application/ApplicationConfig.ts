export interface AppSection {
	category: string;
	fields: AppField[];
	title: string;
}

export interface AppField {
	fieldName: string;
	input: string;
	note?: string;
	placeholder?: string;
	required?: boolean;
	title: string;
	validation?: string;
}
