import { toEnum } from './helpers';
import { ShirtSize } from '../generated/graphql';

describe('Test resolver helpers', () => {
	describe('toEnum', () => {
		it('correctly coerces members of an enum', () => {
			expect(toEnum(ShirtSize)('XS')).toEqual(ShirtSize.Xs);
		});

		it('throws an error when the item is not in the enum', () => {
			expect(() => void toEnum(ShirtSize)('WUMBO')).toThrow(
				`Invalid enum value: "WUMBO" is not in "["XS","S","M","L","XL","XXL"]"`
			);
		});
	});
});
