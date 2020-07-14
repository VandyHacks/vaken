import AWS from 'aws-sdk';
import { UserDbInterface, ApplicationStatus } from '../../../src/client/generated/graphql';
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
	// logger.info(`sending email to ${user.email}`);
	const email = notify(user, message, subject);
	console.log(`sent email to ${user.email}`);

	ses
		.sendEmail(email)
		.promise()
		.then(data => logger.info(`email submitted to SES for ${user.email}`, data))
		.catch(logger.error);
}

export default { sendNotificationEmail };
