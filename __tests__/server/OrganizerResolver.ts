import OrganizerResolver from '../../src/server/resolvers/OrganizerResolver';

// import mockingoose from 'mockingoose';
import Organizer from '../../src/server/data/Organizer';

beforeAll(() => {
	// mockingoose(OrganizerModel).toReturn(null, 'findOne');
});
// const MOCK_EMAIL = 'mock@gmail.com';

describe('Test OrganizerResolver', () => {
	it('initializes', async () => {
		expect(Organizer).toBeTruthy();
		expect(OrganizerResolver).toBeTruthy();
	});
});
