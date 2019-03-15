import { registerEnumType } from 'type-graphql';

export enum ShirtSize {
	UXS,
	US,
	UM,
	UL,
	UXL,
	UXXL,
	WS,
	WM,
	WL,
	WXL,
	WXXL,
}

registerEnumType(ShirtSize, {
	name: 'ShirtSize',
});
