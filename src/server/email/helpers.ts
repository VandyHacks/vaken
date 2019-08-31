import nodemailer from 'nodemailer';
import { FindAndModifyWriteOpResultObject } from 'mongodb';
import DB, { Models } from '../models';
import STRINGS from '../../client/assets/strings.json';
import { ApplicationStatus, EmailType, EmailedListDbObject } from '../generated/graphql';

export const filterOutSentEmailsAndDuplicates = (
	allEmails: string[],
	emailedList: EmailedListDbObject | null
): string[] => {
	const dedupedEmails = Array.from(new Set(allEmails));
	return emailedList
		? dedupedEmails.filter(email => !emailedList.emails.includes(email))
		: dedupedEmails;
};

export const updateEmailedList = async (
	emailType: EmailType,
	newEmails: string[],
	models: Models
): Promise<FindAndModifyWriteOpResultObject> => {
	const { EmailedLists } = await models;
	return EmailedLists.findOneAndUpdate(
		{ emailType },
		{ $push: { emails: { $each: newEmails } } },
		{ upsert: true }
	);
};

export const findRecipientsForAcceptanceMail = async (models: Models): Promise<string[]> => {
	const { Hackers } = await models;
	return Hackers.find({ status: ApplicationStatus.Accepted })
		.map(hacker => hacker.email)
		.toArray();
};

export const makeMailOptions = (
	emailType: EmailType,
	recipient: string
): nodemailer.SendMailOptions => ({
	from: `"${STRINGS.FULL_NAME}" <${STRINGS.HELP_EMAIL}>`,
	// TODO(timliang): replace these placeholders with content generated per EmailType
	html: '<b>Hello world?</b>',
	subject: 'Hello',
	text: 'Hello world?',
	to: recipient,
});

// TODO(timliang): Maybe implement some type of queue. Probably not worth the edge case, though.
let sendEmailsLock = false;
export const sendEmailsInternal = async (
	emailType: EmailType,
	recipients: string[],
	transporter: nodemailer.Transporter,
	models: Models
): Promise<string[]> => {
	if (sendEmailsLock) {
		return [];
	}
	sendEmailsLock = true;

	const { EmailedLists } = await models;
	const emailedList = await EmailedLists.findOne({
		emailType,
	});
	const filteredRecipients = filterOutSentEmailsAndDuplicates(recipients, emailedList);
	filteredRecipients.forEach(async recipient => {
		// TODO(timliang): Check/Return statuses of each sendMail operation
		await transporter.sendMail(makeMailOptions(emailType, recipient));
	});
	await updateEmailedList(emailType, filteredRecipients, models);

	sendEmailsLock = false;
	return filteredRecipients;
};

export const sendEmails = async (emailType: EmailType): Promise<void> => {
	let recipients: string[];

	const dbClient = new DB();
	const models = await dbClient.collections;

	switch (emailType) {
		case EmailType.Acceptance:
			recipients = await findRecipientsForAcceptanceMail(models);
			break;
		case EmailType.Test:
		default:
			recipients = [];
	}

	// TODO(timliang): create a real account and transporter
	const account = await nodemailer.createTestAccount();
	const transporter = nodemailer.createTransport({
		auth: {
			pass: account.pass,
			user: account.user,
		},
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false,
	});

	await sendEmailsInternal(emailType, recipients, transporter, models);
};

export default sendEmails;
