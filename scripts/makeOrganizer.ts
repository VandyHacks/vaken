import { ObjectId } from 'mongodb';
import modelsPromise from '../src/server/models';
import { LoginDbObject, UserType } from '../src/server/generated/graphql';

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const printUsage = (): void =>
	void console.log(
		`Usage: ts-node -r dotenv/config ./scripts/makeOrganizer.ts -- YOUR_EMAIL@FOO.COM [github] [google]`
	);

(async (): Promise<void> => {
	const args = process.argv.splice(process.execArgv.length);
	if (!args.length || args.length > 2 || !EMAIL_REGEX.test(args[0])) printUsage();
	const models = await modelsPromise;

	const constraint: Partial<LoginDbObject> = {
		email: args[0],
		provider: args[1] || undefined,
	};

	const user = await models.Hackers.findOne({ email: args[0] });
	if (!user) {
		console.error(`Couldn't find your user... did you try logging in first?`);
		return void process.exit(1);
	}

	// Update the user's login entry to point to organizers.
	const { value, ok, lastErrorObject } = await models.Logins.findOneAndUpdate(
		constraint,
		{ $set: { userType: UserType.Organizer } },
		{ returnOriginal: false }
	);
	if (!ok || !value) {
		console.error(lastErrorObject);
		return void process.exit(2);
	}

	// Only insert user into organizers collection if changing login was successful.
	const { result } = await models.Organizers.insertOne({
		...user,
		_id: new ObjectId(),
		logins: [value],
		permissions: [],
	});
	if (!result.ok) {
		console.error('Error: (Unspecified) while inserting user into organizers collection');
		return void process.exit(3);
	}

	console.log(`${args[0]} is now an organizer :) Happy hacking!`);
	return void process.exit();
})();
