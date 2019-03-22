import { registerEnumType } from 'type-graphql';

export enum Status {
	Created,
	Verified,
	Started,
	Submitted,
	Accepted,
	Confirmed,
	Rejected,
}

registerEnumType(Status, {
	name: 'Status',
});
