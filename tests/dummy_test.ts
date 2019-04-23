// from https://basarat.gitbooks.io/typescript/docs/testing/jest.html

const sum = (...a: number[]) => a.reduce((acc, val) => acc + val, 0);

test('basic', () => {
  expect(sum()).toBe(0);
});

test('basic again', () => {
  expect(sum(1, 2)).toBe(3);
});
