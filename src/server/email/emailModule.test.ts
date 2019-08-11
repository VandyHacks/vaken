import nodemailer from 'nodemailer';
import modelsPromise from '../models';
import {
	sendEmailsImpl,
	updateEmailedList,
	findRecipientsForAcceptanceMail,
	filterOutSentEmailsAndDuplicates,
} from './emailModule';
import { ApplicationStatus, EmailType, EmailedListDbObject } from '../generated/graphql';

const uniqueRecipientsList = ['a@test.com', 'b@test.com', 'c@test.com', 'd@test.com'];
const uniqueRecipientsList2 = ['a1@test.com', 'b1@test.com', 'c1@test.com', 'd1@test.com'];
const duplicateRecipientsList = ['a2@test.com', 'a2@test.com', 'b2@test.com', 'c2@test.com'];

const mockTestEmailedList: EmailedListDbObject = {
	emailType: EmailType.Test,
	emails: ['a@test.com', 'b@test.com', 'c@test.com'],
};

const createTestTransporter = async (): Promise<nodemailer.Transporter> => {
	const testAccount = await nodemailer.createTestAccount();
	return nodemailer.createTransport({
		auth: {
			pass: testAccount.pass,
			user: testAccount.user,
		},
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false,
	});
};

describe('Test filterOutSentEmailsAndDuplicates ', () => {
	it('returns all emails if emailed list is null', () => {
		expect(filterOutSentEmailsAndDuplicates(uniqueRecipientsList, null)).toEqual(
			uniqueRecipientsList
		);
	});

	it('removes emails in emailed list from recipients list', () => {
		expect(filterOutSentEmailsAndDuplicates(uniqueRecipientsList, mockTestEmailedList)).toEqual([
			'd@test.com',
		]);
	});

	it('removes duplicate emails', () => {
		expect(filterOutSentEmailsAndDuplicates(duplicateRecipientsList, null)).toEqual(
			Array.from(new Set(duplicateRecipientsList))
		);
	});
});

// TOOD(timliang): Change to use MongoDB mock when its merged.
describe('Test updateEmailedList', () => {
	it('creates and updates a new EmailedList if one did not exist', async () => {
		// Reset Test DB.
		const { EmailedLists } = await modelsPromise;
		await EmailedLists.deleteMany({ emailType: EmailType.Test });
		expect(await EmailedLists.findOne({ emailType: EmailType.Test })).toBeFalsy();

		await updateEmailedList(EmailType.Test, uniqueRecipientsList);
		const updatedEmailedList = await EmailedLists.findOne({ emailType: EmailType.Test });
		expect(updatedEmailedList).toBeTruthy();
		if (updatedEmailedList) {
			expect(updatedEmailedList.emails).toEqual(uniqueRecipientsList);
		}
	});

	it('appends to existing EmailedList without deleting previous information', async () => {
		const { EmailedLists } = await modelsPromise;
		await updateEmailedList(EmailType.Test, uniqueRecipientsList2);
		const updatedEmailedLists = await EmailedLists.find({ emailType: EmailType.Test }).toArray();
		expect(updatedEmailedLists).toBeTruthy();
		if (updatedEmailedLists) {
			expect(updatedEmailedLists.length).toBe(1);
			const updatedEmailedList = updatedEmailedLists[0];
			expect(updatedEmailedList.emails).toEqual(uniqueRecipientsList.concat(uniqueRecipientsList2));
		}
	});
});

// TOOD(timliang): Change to use MongoDB mock when its merged.
describe('Test sendEmailsImpl', () => {
	it('updates emailed database', async () => {
		// Reset Test DB.
		const { EmailedLists } = await modelsPromise;
		await EmailedLists.deleteMany({ emailType: EmailType.Test });
		expect(await EmailedLists.findOne({ emailType: EmailType.Test })).toBeFalsy();

		const testTransporter = await createTestTransporter();
		expect(await sendEmailsImpl(EmailType.Test, uniqueRecipientsList, testTransporter)).toEqual(
			uniqueRecipientsList
		);

		const updatedEmailedList = await EmailedLists.findOne({ emailType: EmailType.Test });
		expect(updatedEmailedList).toBeTruthy();
		if (updatedEmailedList) {
			expect(updatedEmailedList.emails).toEqual(uniqueRecipientsList);
		}
	});

	it('does not send out emails to the filtered out recipients', async () => {
		const { EmailedLists } = await modelsPromise;

		const testTransporter = await createTestTransporter();
		expect(
			await sendEmailsImpl(
				EmailType.Test,
				uniqueRecipientsList.concat(duplicateRecipientsList),
				testTransporter
			)
		).toEqual(Array.from(new Set(duplicateRecipientsList)));

		const updatedEmailedList = await EmailedLists.findOne({ emailType: EmailType.Test });
		expect(updatedEmailedList).toBeTruthy();
		if (updatedEmailedList) {
			expect(updatedEmailedList.emails).toEqual(
				uniqueRecipientsList.concat(Array.from(new Set(duplicateRecipientsList)))
			);
		}
	});

	it('has no database race condition', async () => {
		// Reset Test DB.
		const { EmailedLists } = await modelsPromise;
		await EmailedLists.deleteMany({ emailType: EmailType.Test });
		expect(await EmailedLists.findOne({ emailType: EmailType.Test })).toBeFalsy();

		const testTransporter = await createTestTransporter();
		const result = sendEmailsImpl(EmailType.Test, uniqueRecipientsList, testTransporter);
		const result2 = sendEmailsImpl(EmailType.Test, uniqueRecipientsList, testTransporter);
		expect(await result).toEqual(uniqueRecipientsList);
		expect(await result2).toEqual([]);

		const updatedEmailedList = await EmailedLists.findOne({ emailType: EmailType.Test });
		expect(updatedEmailedList).toBeTruthy();
		if (updatedEmailedList) {
			const { emails } = updatedEmailedList;
			expect(emails).toEqual(uniqueRecipientsList);
		}
	});
});

describe('Test findRecipientsForAcceptanceMail', () => {
	it('only finds emails belonging to accepted hackers', async () => {
		const { Hackers } = await modelsPromise;
		const emails = await findRecipientsForAcceptanceMail();
		emails.forEach(async email => {
			const hacker = await Hackers.findOne({ email });
			expect(hacker).toBeTruthy();
			if (hacker) {
				expect(hacker.status).toBe(ApplicationStatus.Accepted);
			}
		});
	});
});
