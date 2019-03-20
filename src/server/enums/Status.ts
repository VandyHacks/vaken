import { registerEnumType } from 'type-graphql';

export enum Status {
	Verified,
	Started,
	Rejected,
	Submitted,
	Accepted,
	Confirmed,
}

registerEnumType(Status, {
	name: 'Status',
});
