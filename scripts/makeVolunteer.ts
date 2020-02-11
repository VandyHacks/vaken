import DB, { Models } from '../src/server/models';
import { LoginDbObject, UserType } from '../src/server/generated/graphql';

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const printUsage = (): void => {
    // eslint-disable-next-line no-console
    void console.log(
        `Usage: ts-node -r dotenv/config ./scripts/makeVolunteer.ts -- YOUR_EMAIL@FOO.COM,BEN@FOO.COM [github | google]`
    );
};

const makeVolunteer = async (models: Models, constraint: Partial<LoginDbObject>): Promise<void> => {
    const user = await models.Hackers.findOneAndUpdate({ email: constraint.email }, { $set: { userType: UserType.Volunteer } });
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

    // eslint-disable-next-line no-console
    console.log(`${constraint.email} is now a VOLUNTEER :) Happy hacking!`);
};

(async (): Promise<void> => {
    const args = process.argv.splice(process.execArgv.length);
    if (!args.length || args.length > 2 || !EMAIL_REGEX.test(args[0])) printUsage();
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
