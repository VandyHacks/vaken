import { Storage, GetSignedUrlConfig } from '@google-cloud/storage';
import JSZip from 'jszip';
import DB from '../models';
import { RESUME_DUMP_NAME } from '../../client/assets/strings.json';

const { BUCKET_NAME, GCP_STORAGE_SERVICE_ACCOUNT } = process.env;

if (BUCKET_NAME == null) {
	throw new Error('BUCKET_NAME not set');
}
if (GCP_STORAGE_SERVICE_ACCOUNT == null) {
	throw new Error('GCP_STORAGE_SERVICE_ACCOUNT not set');
}

// These options will allow temporary read access to the file
export const getSignedUploadUrl = async (filename: string): Promise<string> => {
	const credentials = JSON.parse(GCP_STORAGE_SERVICE_ACCOUNT);
	const storage = new Storage({ credentials });

	// Check for resume dump. Remove if exists.
	await storage.bucket(BUCKET_NAME).file(RESUME_DUMP_NAME).delete({ ignoreNotFound: true });

	const options: GetSignedUrlConfig = {
		action: 'write' as const,
		contentType: 'application/pdf',
		expires: Date.now() + 15 * 60 * 1000, // 15 minutes
		version: 'v4' as const,
		extensionHeaders: {
			'x-goog-content-length-range': '0,5242880',
		},
	};

	const [url] = await storage.bucket(BUCKET_NAME).file(filename).getSignedUrl(options);

	return url;
};

export const getSignedReadUrl = async (filename: string): Promise<string> => {
	const credentials = JSON.parse(GCP_STORAGE_SERVICE_ACCOUNT);
	const storage = new Storage({ credentials });

	const options: GetSignedUrlConfig = {
		action: 'read' as const,
		expires: Date.now() + 24 * 60 * 60 * 1000, // 7 days
		version: 'v4' as const,
	};

	const [url] = await storage.bucket(BUCKET_NAME).file(filename).getSignedUrl(options);

	return url;
};

export const getResumeDumpUrl = async (): Promise<string> => {
	const credentials = JSON.parse(GCP_STORAGE_SERVICE_ACCOUNT);
	const bucket = new Storage({ credentials }).bucket(BUCKET_NAME);
	const models = await new DB().collections;
	if (!(await bucket.file(RESUME_DUMP_NAME).exists())[0]) {
		const zip = JSZip();

		await Promise.all(
			await models.Hackers.find({
				status: { $in: ['ACCEPTED', 'SUBMITTED', 'CONFIRMED'] },
			})
				.map(async hacker => {
					const storedFilename = hacker._id.toHexString();
					const fileContents = (await bucket.file(storedFilename).download())[0];
					const readableFilename = `${hacker.lastName}, ${hacker.firstName} (${hacker.school}).pdf`;
					zip.file(readableFilename, fileContents);
				})
				.toArray()
		);

		const dump = await zip.generateAsync({ type: 'nodebuffer' });
		await bucket.file(RESUME_DUMP_NAME).save(dump, { resumable: false });
	}

	return getSignedReadUrl(RESUME_DUMP_NAME);
};
