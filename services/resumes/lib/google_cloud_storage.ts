import { Storage, GetSignedUrlConfig, Bucket } from '@google-cloud/storage';
import JSZip from 'jszip';
import { extension } from 'mime-types';
import { getHackers } from './query/users';

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

export const getFilename = async (userId: string): Promise<string | null> => {
	// The files are stored by `userId` at upload time. The
	// response-content-disposition parameter sent during upload will ensure it's
	// named correctly when the user downloads it.
	const [files] = await bucket.getFiles({ prefix: userId });
	if (!files.length || !files[0]) {
		return null;
	}
	const file = files[0];

	const [fileMetadata] = await file.getMetadata();
	return fileMetadata['metadata']?.['filename'] ?? null;
};

// These options will allow temporary read access to the file
export const getSignedUploadUrl = async (
	userId: string,
	userFilename: string,
	userContentType: string
): Promise<{ url: string; headers: { key: string; value: string }[] }> => {
	if (!bucket) {
		throw new Error('GCS integration disabled');
	}
	if (GCS_RESUME_DUMP_FILENAME) {
		// Check for resume dump. Remove if exists, as its contents will be
		// invalidated after a new resume is uploaded.
		bucket.file(GCS_RESUME_DUMP_FILENAME).delete({ ignoreNotFound: true });
	}

	const filename =
		userFilename.length > 110
			? `${userFilename.slice(0, 90)}[...]${userFilename.slice(-10)}`
			: userFilename;
	// Validate the contentType by attempting to look it up
	const contentType = extension(userContentType) ? userContentType : 'application/octet-stream';

	const options: GetSignedUrlConfig = {
		action: 'write',
		contentType,
		expires: Date.now() + 15 * 60 * 1000, // 15 minutes
		version: 'v4',
		extensionHeaders: {
			// Maximum size of 10MiB to prevent abuse
			'x-goog-content-length-range': '0,10485760',
			'x-goog-meta-filename': filename,
		},
		// The Content-Disposition header sent during upload will ensure it's
		// named correctly when the user downloads it.
		responseDisposition: `inline; filename="${filename}"`,
	};
	const headers = [
		{ key: 'X-Goog-Content-Length-Range', value: '0,10485760' },
		{ key: 'X-Goog-Meta-Filename', value: filename },
		{ key: 'Content-Type', value: contentType },
		{ key: 'Content-Disposition', value: `inline; filename="${filename}"` },
	];
	const [url] = await bucket.file(userId).getSignedUrl(options);

	return { url, headers };
};

export const getSignedReadUrl = async (userId: string): Promise<string | null> => {
	if (!GCS_SERVICE_ACCOUNT || !GCS_BUCKET_NAME) {
		throw new Error('GCS integration disabled');
	}

	// The files are stored by `userId` at upload time. The
	// response-content-disposition parameter sent during upload will ensure it's
	// named correctly when the user downloads it.
	const [files] = await bucket.getFiles({ prefix: userId });
	if (!files.length || !files[0]) {
		return null;
	}
	const file = files[0];

	const options: GetSignedUrlConfig = {
		action: 'read',
		expires: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days
		version: 'v4',
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
	const zip = new JSZip();
	const [[fileArr], hackers] = await Promise.all([bucket.getFiles(), getHackers()]);
	const files = new Map<string, typeof fileArr[number]>();
	for (const file of fileArr) {
		files.set(file.name, file);
	}
	console.error(files.keys());
	console.error(hackers);
	await Promise.all(
		hackers?.map(async hacker => {
			const storedFile = files.get(hacker.id);
			if (!storedFile) {
				return null;
			}
			const [fileMetadata] = await storedFile.getMetadata();
			const fileExtension = extension(fileMetadata['contentType']);
			const [fileContents] = await storedFile.download();
			const readableFilename = `${hacker.email}-${hacker.id}.${fileExtension}`;
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
