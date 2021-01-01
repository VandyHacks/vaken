import * as EmailValidator from 'email-validator';
import DB, { Models } from '../src/server/models';
import { LoginDbObject, UserType } from '../src/server/generated/graphql';

const printUsage = (): void => {
	void console.log(
		`Usage: ts-node -r dotenv/config ./scripts/makeVolunteer.ts -- YOUR_EMAIL@FOO.COM,BEN@FOO.COM [github | google]`
	);
};

const makeVolunteer = async (models: Models, constraint: Partial<LoginDbObject>): Promise<void> => {
	const user = await models.Hackers.findOneAndUpdate(
		{ email: constraint.email },
		{ $set: { userType: UserType.Volunteer } }
	);
	if (!user) {
		throw new Error(`Couldn't find user ${constraint.email} did you try logging in first?`);
	}

	// Update the user's login entry to point to volunteers.
	const { value, ok, lastErrorObject } = await models.Logins.findOneAndUpdate(
		constraint,
		{ $set: { userType: UserType.Volunteer } },
		{ returnOriginal: false }
	);
	if (!ok || !value) {
		throw new Error(`Error updating logins: ${JSON.stringify(lastErrorObject)}`);
	}

	console.log(`${constraint.email} is now a VOLUNTEER :) Happy hacking!`);
};

(async (): Promise<void> => {
	const args = process.argv.splice(process.execArgv.length);
	if (!args.length || args.length > 2 || !EmailValidator.validate(args[0])) printUsage();
	const models = await new DB().collections;

	try {
		await Promise.all(
			args[0].split(',').map(email => {
				const constraint: Partial<LoginDbObject> = args[1]
					? { email, provider: args[1] }
					: { email };

				return makeVolunteer(models, constraint);
			})
		);
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
})();
