import { registerEnumType } from 'type-graphql';

export enum AuthLevel {
	HACKER = 'Hacker',
	ORGANIZER = 'Organizer',
	SPONSOR = 'Sponsor',
}

registerEnumType(AuthLevel, {
	name: 'AuthLevel',
});
