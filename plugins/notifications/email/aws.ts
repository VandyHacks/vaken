import AWS from 'aws-sdk';
import { UserDbInterface } from '../../../src/client/generated/graphql';
import notify from './email-notification';
import logger from '../../../src/server/logger';

const { AWS_REGION } = process.env;

if (AWS_REGION == null) {
	throw new Error('AWS_REGION not set');
}

AWS.config.update({ region: AWS_REGION });

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

export function sendNotificationEmail(
	user: UserDbInterface,
	message: string,
	subject: string
): void {
	if (user.emailUnsubscribed) {
		logger.info(`Skipping email to unsubscribed user`, user);
		return;
	}
	const email = notify(user, message, subject);

	ses
		.sendEmail(email)
		.promise()
		.catch(logger.error);
}
