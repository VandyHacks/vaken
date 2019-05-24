import SponsorRepResolver from '../../src/server/resolvers/SponsorRepResolver';

// import mockingoose from 'mockingoose';
import SponsorRep from '../../src/server/data/SponsorRep';

beforeAll(() => {
	// mockingoose(SponsorModel).toReturn(null, 'findOne');
});
// const MOCK_EMAIL = 'mock@gmail.com';

describe('Test SponsorRepResolver', () => {
	it('initializes', async () => {
		expect(SponsorRep).toBeTruthy();
		expect(SponsorRepResolver).toBeTruthy();
	});
});
