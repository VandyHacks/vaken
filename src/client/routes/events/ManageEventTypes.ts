export interface EventUpdate {
	name: string;
	startTimestamp: string; // UTC time in format YYYY-MM-DDTHH:MM:SS.mmm+00:00
	duration: number;
	description: string;
	location: string;
	eventType: string;
	eventScore?: number;
	gcalID?: string;
	id?: string;
}
