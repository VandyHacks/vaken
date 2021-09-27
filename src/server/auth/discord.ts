import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import express from 'express';
import {
	ApplicationStatus,
	UserType,
	UserDbInterface,
	HackerDbObject,
} from '../../client/generated/graphql';

const {
	DISCORD_CALLBACK_URL,
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	DISCORD_BOT_TOKEN,
	DISCORD_SERVER_ID,
} = process.env;

function verify(req: express.Request): boolean {
	// If we're not signed in, reject
	const session = req.user as UserDbInterface;
	if (!session) {
		return false;
	}

	// If the user is a hacker, we need to make sure
	// they're confirmed (any other user type is good
	// to go without confirmation)
	if (session.userType === UserType.Hacker) {
		const hackerSession = session as HackerDbObject;

		if (hackerSession.status !== ApplicationStatus.Confirmed) {
			return false;
		}
	}

	return true;
}

export function sendToDiscord(req: express.Request, res: express.Response): void {
	if (!verify(req)) {
		res.redirect('/');
		return;
	}

	res.redirect(
		`https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
			`${req.protocol}://${req.get('host')}${DISCORD_CALLBACK_URL}`
		)}&response_type=code&scope=guilds.join`
	);
}

export async function discordCallback(req: express.Request, res: express.Response): Promise<void> {
	if (!verify(req)) {
		res.redirect('/');
		return;
	}

	// Create params for OAuth and send request to get token
	const params = new URLSearchParams();
	params.append('code', <string>req.query.code);
	params.append('client_id', <string>DISCORD_CLIENT_ID);
	params.append('client_secret', <string>DISCORD_CLIENT_SECRET);
	params.append('grant_type', 'authorization_code');
	params.append('redirect_uri', `${req.protocol}://${req.get('host')}${DISCORD_CALLBACK_URL}`);
	const tokens = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: params,
	})
		.then(r => r.json())
		.catch(console.error);

	// Get user information (for ID)
	const user = await fetch('https://discord.com/api/users/@me', {
		method: 'GET',
		headers: { Authorization: `Bearer ${tokens.access_token}` },
	})
		.then(r => r.json())
		.catch(console.error);

	// Add user to Discord server
	await fetch(`https://discord.com/api/guilds/${DISCORD_SERVER_ID}/members/${user.id}`, {
		method: 'PUT',
		body: JSON.stringify({
			access_token: tokens.access_token,
		}),
		headers: {
			Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
			'Content-Type': 'application/json',
		},
	});
	res.redirect(`/?msg=${encodeURIComponent("Check your Discord -- you've been added!")}`);
}
