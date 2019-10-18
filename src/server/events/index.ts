import { google as gapis } from 'googleapis';
import { GaxiosResponse } from 'gaxios';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

const CALENDER_URL = 'vanderbilt.edu_8p58kn7032badn5et22pq1iqjs@group.calendar.google.com';

export const CALENDAR_SCOPES: string[] = [
	'https://www.googleapis.com/auth/calendar.readonly',
	'https://www.googleapis.com/auth/calendar.events.readonly',
];

const oauth2Client = new gapis.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

gapis.options({ auth: oauth2Client });

export async function apiAuthenticate(tokens: Record<string, any>): Promise<void> {
	// const authorizeUrl = await oauth2Client.generateAuthUrl({
	// 	scope: SCOPES.join(' '),
	// });
	// console.log('CALLBACK DATA: ', url);
	// return callbackData.text();
	// const { tokens } = await oauth2Client.getToken(qs.get('code'));
	console.log('HEY WHATS GOING ON HERE', tokens);
	oauth2Client.credentials = tokens;
}

export async function getCalendar(): Promise<GaxiosResponse<any> | void> => {
	const res = await gapis
		.calendar('v3')
		.calendars.get({
			calendarId: CALENDER_URL,
		})
		.catch(console.error);
	console.log(res);
	return res;
};
