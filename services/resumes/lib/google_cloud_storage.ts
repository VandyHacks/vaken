import { Storage, GetSignedUrlConfig, Bucket } from '@google-cloud/storage';
import JSZip from 'jszip';
import mime from 'mime-types';
import { getHackers, getUser } from './query/users_query';

const { GCS_BUCKET_NAME, GCS_SERVICE_ACCOUNT, GCS_RESUME_DUMP_FILENAME } = process.env;

if (!GCS_BUCKET_NAME) {
	console.warn('GCS_BUCKET_NAME not set');
}
if (!GCS_SERVICE_ACCOUNT) {
	console.warn('GCS_SERVICE_ACCOUNT not set');
}
if (!GCS_RESUME_DUMP_FILENAME) {
	console.warn('GCS_RESUME_DUMP_FILENAME not set.');
}

let bucket: Bucket;
if (!GCS_BUCKET_NAME || !GCS_SERVICE_ACCOUNT) {
	console.warn(
		'Google Cloud Storage environment variables not set. GCS integration will be disabled.'
	);
} else {
	const credentials = JSON.parse(GCS_SERVICE_ACCOUNT);
	bucket = new Storage({ credentials }).bucket(GCS_BUCKET_NAME);
}

// These options will allow temporary read access to the file
export const getSignedUploadUrl = async (userId: string, contentType: string): Promise<string> => {
	if (!bucket) {
		throw new Error('GCS integration disabled');
	}
	if (GCS_RESUME_DUMP_FILENAME) {
		// Check for resume dump. Remove if exists.
		bucket.file(GCS_RESUME_DUMP_FILENAME).delete({ ignoreNotFound: true });
	}
	const fileExt = mime.extension(contentType);

	// The files are stored by userId.extension at upload time. We only have the
	// `userId` portion, so we use a prefix match to find any existing uploads by
	// that user and remove them
	const [files] = await bucket.getFiles({ prefix: userId });
	if (files.length) {
		files.forEach(file => bucket.file(file.name).delete({ ignoreNotFound: true }));
	}

	const options: GetSignedUrlConfig = {
		action: 'write',
		contentType,
		expires: Date.now() + 15 * 60 * 1000, // 15 minutes
		version: 'v4',
		extensionHeaders: {
			// Maximum size of 10MiB to prevent abuse
			'x-goog-content-length-range': '0,10485760',
		},
	};
	const [url] = await bucket.file(`${userId}.${fileExt}`).getSignedUrl(options);

	return url;
};

export const getSignedReadUrl = async (userId: string): Promise<string | null> => {
	if (!GCS_SERVICE_ACCOUNT || !GCS_BUCKET_NAME) {
		throw new Error('GCS integration disabled');
	}

	// Start fetching the user now, so the async operation is complete by the time
	// we figure out which file to use.
	const userPromise = getUser({ id: userId });

	// The files are stored by userId.extension at upload time. We only have the
	// `userId` portion, so we use a prefix match to find the right file and use
	// `responseDisposition` to rename it at download time.
	const [files] = await bucket.getFiles({ prefix: userId });
	if (!files.length || !files[0]) {
		return null;
	}
	const file = files[0];
	const extension = file.name.substring(file.name.lastIndexOf('.')) || '';
	const contentType = mime.contentType(extension) || 'application/octet-stream';
	const user = await userPromise;

	const options: GetSignedUrlConfig = {
		action: 'read',
		contentType,
		expires: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
		version: 'v4',
		// responseDisposition will save the file according to `filename`. Rename the
		// file to the user's name, if it exists:
		responseDisposition: `inline; filename="${
			user ? `${user.email}-${user.id}${extension}` : `${userId}${extension}`
		}"`,
	};
	const [url] = await bucket.file(file.name).getSignedUrl(options);

	return url;
};

// Downloads and zips resumes of hackers who submitted an application.
export const getResumeDumpUrl = async (): Promise<string | null> => {
	if (!bucket || !GCS_RESUME_DUMP_FILENAME) {
		throw new Error('GCS integration disabled');
	}
	if ((await bucket.file(GCS_RESUME_DUMP_FILENAME).exists())[0]) {
		return getSignedReadUrl(GCS_RESUME_DUMP_FILENAME);
	}

	// Download and zip resumes for hackers that submitted an application and have a resume.
	const zip = JSZip();
	const [[files], hackers] = await Promise.all([bucket.getFiles(), getHackers()]);
	await Promise.all(
		hackers?.map(async hacker => {
			const storedFilename = files.find(file => file.name.startsWith(hacker.id))?.name;
			if (!storedFilename) {
				return null;
			}
			const extension = storedFilename.substring(storedFilename.lastIndexOf('.')) || '';
			const [fileContents] = await bucket.file(storedFilename).download();
			const readableFilename = `${hacker.email}-${hacker.id}.${extension}`;
			zip.file(readableFilename, fileContents);
			return undefined;
		}) ?? []
	);

	const dump = await zip.generateAsync({ type: 'nodebuffer' });
	await bucket
		.file(GCS_RESUME_DUMP_FILENAME)
		.save(dump, { resumable: false, contentType: 'application/zip' });

	return getSignedReadUrl(GCS_RESUME_DUMP_FILENAME);
};
