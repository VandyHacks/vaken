import nodemailer from 'nodemailer';
import { ObjectId, Db } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import DB, { Models } from '../models';
import {
	sendEmailsInternal,
	updateEmailedList,
	findRecipientsForAcceptanceMail,
	filterOutSentEmailsAndDuplicates,
} from './helpers';
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

let mongoServer: MongoMemoryServer;
let dbClient: DB;
let models: Models;

beforeAll(async () => {
	try {
		mongoServer = new MongoMemoryServer();
		const mongoUri = await mongoServer.getConnectionString();
		dbClient = new DB(mongoUri);
		models = await dbClient.collections;
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err);
	}
});

afterAll(async () => {
	try {
		if (dbClient) await dbClient.disconnect();
		if (mongoServer) await mongoServer.stop();
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err);
	}
});

describe('Test email helpers', () => {
	describe('filterOutSentEmailsAndDuplicates', () => {
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
	describe('updateEmailedList', () => {
		it('creates and updates a new EmailedList if one did not exist', async () => {
			// Reset Test DB.
			const { EmailedLists } = await models;
			await EmailedLists.deleteMany({ emailType: EmailType.Test });
			expect(await EmailedLists.findOne({ emailType: EmailType.Test })).toBeFalsy();

			await updateEmailedList(EmailType.Test, uniqueRecipientsList, models);
			const updatedEmailedList = await EmailedLists.findOne({ emailType: EmailType.Test });
			expect(updatedEmailedList).toBeTruthy();
			if (updatedEmailedList) {
				expect(updatedEmailedList.emails).toEqual(uniqueRecipientsList);
			}
		});

		it('appends to existing EmailedList without deleting previous information', async () => {
			const { EmailedLists } = await models;
			await updateEmailedList(EmailType.Test, uniqueRecipientsList2, models);
			const updatedEmailedLists = await EmailedLists.find({ emailType: EmailType.Test }).toArray();
			expect(updatedEmailedLists).toBeTruthy();
			if (updatedEmailedLists) {
				expect(updatedEmailedLists.length).toBe(1);
				const updatedEmailedList = updatedEmailedLists[0];
				expect(updatedEmailedList.emails).toEqual(
					uniqueRecipientsList.concat(uniqueRecipientsList2)
				);
			}
		});
	});

	// TOOD(timliang): Change to use MongoDB mock when its merged.
	describe('sendEmailsInternal', () => {
		it('updates emailed database', async () => {
			// Reset Test DB.
			const { EmailedLists } = await models;
			await EmailedLists.deleteMany({ emailType: EmailType.Test });
			expect(await EmailedLists.findOne({ emailType: EmailType.Test })).toBeFalsy();

			const testTransporter = await createTestTransporter();
			expect(
				await sendEmailsInternal(EmailType.Test, uniqueRecipientsList, testTransporter, models)
			).toEqual(uniqueRecipientsList);

			const updatedEmailedList = await EmailedLists.findOne({ emailType: EmailType.Test });
			expect(updatedEmailedList).toBeTruthy();
			if (updatedEmailedList) {
				expect(updatedEmailedList.emails).toEqual(uniqueRecipientsList);
			}
		});

		it('does not send out emails to the filtered out recipients', async () => {
			const { EmailedLists } = await models;
			const testTransporter = await createTestTransporter();
			expect(
				await sendEmailsInternal(
					EmailType.Test,
					uniqueRecipientsList.concat(duplicateRecipientsList),
					testTransporter,
					models
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
			const { EmailedLists } = await models;
			await EmailedLists.deleteMany({ emailType: EmailType.Test });
			expect(await EmailedLists.findOne({ emailType: EmailType.Test })).toBeFalsy();

			const testTransporter = await createTestTransporter();
			const result = sendEmailsInternal(
				EmailType.Test,
				uniqueRecipientsList,
				testTransporter,
				models
			);
			const result2 = sendEmailsInternal(
				EmailType.Test,
				uniqueRecipientsList,
				testTransporter,
				models
			);
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

	describe('findRecipientsForAcceptanceMail', () => {
		it('only finds emails belonging to accepted hackers', async () => {
			const { Hackers } = await models;
			const emails = await findRecipientsForAcceptanceMail(models);
			emails.forEach(async email => {
				const hacker = await Hackers.findOne({ email });
				expect(hacker).toBeTruthy();
				if (hacker) {
					expect(hacker.status).toBe(ApplicationStatus.Accepted);
				}
			});
		});
	});
});
