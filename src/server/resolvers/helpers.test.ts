import { ObjectId } from 'mongodb';
import { toEnum, checkIsAuthorized } from './helpers';
import { ShirtSize, UserType, UserDbInterface } from '../generated/graphql';

const hacker: UserDbInterface = {
	_id: new ObjectId(),
	createdAt: new Date(),
	dietaryRestrictions: [],
	email: 'foo@bar.baz',
	firstName: 'Foo',
	lastName: 'Bar',
	logins: [],
	preferredName: 'Foo',
	secondaryIds: [],
	userType: UserType.Hacker,
};

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

	describe('checkIsAuthorized', () => {
		it('throws an error if the user is not a member of the specified group', () => {
			expect(() => void checkIsAuthorized(UserType.Organizer, hacker)).toThrow(
				`user foo@bar.baz: ${JSON.stringify(hacker)} must be a "ORGANIZER"`
			);
		});

		it('throws an error if the user is undefined', () => {
			expect(() => void checkIsAuthorized(UserType.Hacker, undefined)).toThrow(
				'user undefined: undefined must be a "HACKER"'
			);
		});

		it('returns the user object passed in', () => {
			expect(checkIsAuthorized(UserType.Hacker, hacker)).toEqual(hacker);
		});
	});
});
