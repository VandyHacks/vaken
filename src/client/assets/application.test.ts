import questions from './application';

describe('Test assets/application', () => {
	it('Initializes', async () => {
		expect(questions).toBeTruthy();
		questions.forEach(e => {
			expect(e).toHaveProperty('category');
			expect(e).toHaveProperty('fields');
			expect(e).toHaveProperty('title');
		});
	});
});
