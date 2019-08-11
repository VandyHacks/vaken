import nodemailer from 'nodemailer';
import { FindAndModifyWriteOpResultObject } from 'mongodb';
import modelsPromise from '../models';
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
	newEmails: string[]
): Promise<FindAndModifyWriteOpResultObject> => {
	const { EmailedLists } = await modelsPromise;
	return EmailedLists.findOneAndUpdate(
		{ emailType },
		{ $push: { emails: { $each: newEmails } } },
		{ upsert: true }
	);
};

export const findRecipientsForAcceptanceMail = async (): Promise<string[]> => {
	const { Hackers } = await modelsPromise;
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
export const sendEmailsImpl = async (
	emailType: EmailType,
	recipients: string[],
	transporter: nodemailer.Transporter
): Promise<string[]> => {
	if (sendEmailsLock) {
		return [];
	}
	sendEmailsLock = true;

	const { EmailedLists } = await modelsPromise;
	const emailedList = await EmailedLists.findOne({
		emailType,
	});
	const filteredRecipients = filterOutSentEmailsAndDuplicates(recipients, emailedList);
	filteredRecipients.forEach(async recipient => {
		// TODO(timliang): Check/Return statuses of each sendMail operation
		await transporter.sendMail(makeMailOptions(emailType, recipient));
	});
	await updateEmailedList(emailType, filteredRecipients);

	sendEmailsLock = false;
	return filteredRecipients;
};

export const sendEmails = async (emailType: EmailType): Promise<void> => {
	let recipients: string[];
	switch (emailType) {
		case EmailType.Acceptance:
			recipients = await findRecipientsForAcceptanceMail();
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

	await sendEmailsImpl(emailType, recipients, transporter);
};

export default sendEmails;
