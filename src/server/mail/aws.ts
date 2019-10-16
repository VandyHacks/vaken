import AWS from 'aws-sdk';
import { UserDbInterface, ApplicationStatus } from '../generated/graphql';
import submitted from './templates/submitted';
import accepted from './templates/accepted';
import confirmed from './templates/confirmed';
import logger from '../logger';

const { AWS_REGION } = process.env;

if (AWS_REGION == null) {
	throw new Error('AWS_REGION not set');
}

AWS.config.update({ region: AWS_REGION });

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

export function sendStatusEmail(user: UserDbInterface, status: ApplicationStatus): void {
	if (user.emailUnsubscribed) {
		logger.info(`Skipping email to unsubscribed user`, user);
	}

	let email: AWS.SES.SendEmailRequest;
	switch (status) {
		case ApplicationStatus.Submitted:
			email = submitted(user);
			break;
		case ApplicationStatus.Accepted:
			email = accepted(user);
			break;
		case ApplicationStatus.Confirmed:
			email = confirmed(user);
			break;
		default:
			throw new Error(`Unimplemented email for status "${status}" to user "${user.email}`);
	}
	
	ses
		.sendEmail(email)
		.promise()
		.then(data => logger.info(`email submitted to SES for ${user.email}`, data))
		.catch(logger.error);
}

export default { sendStatusEmail };
