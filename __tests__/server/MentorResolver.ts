import mockingoose from 'mockingoose';
import MentorResolver from '../../src/server/resolvers/MentorResolver';

import { mentorModel } from '../../src/server/models/Mentor';

beforeAll(() => {
	// mockingoose(mentorModel).toReturn(null, 'findOne');
});
// const MOCK_EMAIL = 'mock@gmail.com';

describe('Test MentorResolver', () => {
	it('initializes', async () => {
		expect(mentorModel).toBeTruthy();
		expect(MentorResolver).toBeTruthy();
	});
});
