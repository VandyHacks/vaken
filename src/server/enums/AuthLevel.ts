import { registerEnumType } from 'type-graphql';

enum AuthLevel {
	HACKER = 'Hacker',
	ORGANIZER = 'Organizer',
	SPONSOR = 'Sponsor',
}

registerEnumType(AuthLevel, {
	name: 'AuthLevel',
});

export default AuthLevel;
