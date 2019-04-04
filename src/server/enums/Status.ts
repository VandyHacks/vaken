import { registerEnumType } from 'type-graphql';

enum Status {
	Created = 'Created',
	Verified = 'Verified',
	Started = 'Started',
	Submitted = 'Submitted',
	Accepted = 'Accepted',
	Confirmed = 'Confirmed',
	Rejected = 'Rejected',
}

registerEnumType(Status, {
	name: 'Status',
});

export default Status;

// Copyright (c) 2019 Vanderbilt University
