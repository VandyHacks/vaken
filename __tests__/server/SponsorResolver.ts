import SponsorResolver from '../../src/server/resolvers/SponsorResolver';

// import mockingoose from 'mockingoose';
import Sponsor from '../../src/server/data/Sponsor';

beforeAll(() => {
	// mockingoose(SponsorModel).toReturn(null, 'findOne');
});
// const MOCK_EMAIL = 'mock@gmail.com';

describe('Test SponsorResolver', () => {
	it('initializes', async () => {
		expect(Sponsor).toBeTruthy();
		expect(SponsorResolver).toBeTruthy();
	});
});
