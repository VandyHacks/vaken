import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import express from 'express';
import {
	ApplicationStatus,
	UserType,
	UserDbInterface,
	HackerDbObject,
} from '../../client/generated/graphql';
import { queryById } from '../../server/resolvers/helpers';

const {
	DISCORD_CALLBACK_URL,
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	DISCORD_BOT_TOKEN,
	DISCORD_SERVER_ID,
	DISCORD_VANDERBILT_ROLE,
	DISCORD_HACKER_ROLE,
	DISCORD_MENTOR_ROLE,
	DISCORD_SPONSOR_ROLE,
} = process.env;

async function verify(req: Express.Request): Promise<boolean> {
	const data: UserDbInterface = await queryById(
		(req.user as any)._id,
		await (req as any).sessionStore.db.collection('Hackers')
	);

	// If we're not signed in, reject
	if (!data) {
		return false;
	}

	// If the user is a hacker, we need to make sure
	// they're confirmed (any other user type is good
	// to go without confirmation)
	if (data.userType === UserType.Hacker) {
		const hackerData = data as HackerDbObject;
		return hackerData.status === ApplicationStatus.Confirmed;
	}

	return true;
}

export async function sendToDiscord(req: express.Request, res: express.Response): Promise<void> {
	if (!(await verify(req))) {
		res.redirect('/');
		return;
	}

	res.redirect(
		`https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
			`${req.protocol}://${req.get('host')}${DISCORD_CALLBACK_URL}`
		)}&response_type=code&scope=guilds.join%20identify`
	);
}

export async function discordCallback(req: express.Request, res: express.Response): Promise<void> {
	if (!(await verify(req))) {
		res.send(401);
		return;
	}

	const failureHandler = (e: any): void => {
		console.error(e);
		res.redirect(`/?msg=${encodeURIComponent('Something broke on our end — try again later.')}`);
	};

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
		.catch(failureHandler);

	// Get user information (for ID)
	const user = await fetch('https://discord.com/api/users/@me', {
		method: 'GET',
		headers: { Authorization: `Bearer ${tokens.access_token}` },
	})
		.then(r => r.json())
		.catch(failureHandler);

	const roles: { [K in string]: string } = {
		SPONSOR: DISCORD_SPONSOR_ROLE as string,
		MENTOR: DISCORD_MENTOR_ROLE as string,
		HACKER: DISCORD_HACKER_ROLE as string,
	};

	const session = req.user as HackerDbObject;
	const userObj = req.user as UserDbInterface;

	const roleSend = [];
	if (session.school === 'Vanderbilt University') {
		roleSend.push(DISCORD_VANDERBILT_ROLE);
	}

	if (Object.keys(roles).includes(userObj.userType)) {
		roleSend.push(roles[userObj.userType]);
	}

	// Add user to Discord server
	await fetch(`https://discord.com/api/guilds/${DISCORD_SERVER_ID}/members/${user.id}`, {
		method: 'PUT',
		body: JSON.stringify({
			access_token: tokens.access_token,
			roles: roleSend,
		}),
		headers: {
			Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
			'Content-Type': 'application/json',
		},
	}).catch(failureHandler);

	res.redirect(`/?msg=${encodeURIComponent("Check your Discord — you've been added!")}`);
}
