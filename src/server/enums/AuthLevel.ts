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

// Copyright (c) 2019 Vanderbilt University
