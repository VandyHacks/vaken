import { registerEnumType } from 'type-graphql';

export enum ShirtSize {
	UXS = 'UXS',
	US = 'US',
	UM = 'UM',
	UL = 'UL',
	UXL = 'UXL',
	UXXL = 'UXXL',
	WS = 'WS',
	WM = 'WM',
	WL = 'WL',
	WXL = 'WXL',
	WXXL = 'WXXL',
}

registerEnumType(ShirtSize, {
	name: 'ShirtSize',
});
