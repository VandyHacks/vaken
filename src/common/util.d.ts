import type { XOR } from 'ts-xor';

/** Utility type which makes an exclusive OR of all properties in T.  */
type oneOf<T> = { [K in keyof T]: Pick<T, K> & FixTsUnion<T, K> }[keyof T];
type FixTsUnion<T, K extends keyof T> = {
	[Prop in keyof T]?: Prop extends K ? T[Prop] : never;
};

/** Exclusive OR between T, U, and V, factoring in all properties of each type. */
type XOR3<T, U, V> = XOR<XOR<T, U>, V>;
