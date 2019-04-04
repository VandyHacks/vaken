import { registerEnumType } from 'type-graphql';

enum AuthType {
	LOCAL = 'Local',
	GOOGLE = 'Google',
	GITHUB = 'Github',
}

registerEnumType(AuthType, {
	name: 'AuthType',
});

export default AuthType;

// Copyright (c) 2019 Vanderbilt University
