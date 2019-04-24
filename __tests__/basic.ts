// from https://basarat.gitbooks.io/typescript/docs/testing/jest.html

const sum = (...a: number[]) => a.reduce((acc, val) => acc + val, 0);

test('basic', () => {
	expect(sum()).toBe(0);
});

test('basic again', () => {
	expect(sum(1, 2)).toBe(3);
});

// This hack is fine for a small testing file:
// https://stackoverflow.com/questions/33977054/cannot-compile-namespaces-when-the-isolatedmodules-flag-is-provided
export const foo = 'foo';
