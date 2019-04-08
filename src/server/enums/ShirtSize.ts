import { registerEnumType } from 'type-graphql';

enum ShirtSize {
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

export default ShirtSize;

// Copyright (c) 2019 Vanderbilt University
