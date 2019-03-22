import { registerEnumType } from 'type-graphql';

export enum Status {
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