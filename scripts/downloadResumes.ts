import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import DB, { Models } from '../src/server/models';

const printUsage = (): void => {
	void console.log(
		'Usage: GCP_STORAGE_SERVICE_ACCOUNT="[service account]" BUCKET_NAME="[bucket name]" ts-node -r dotenv/config ./scripts/downloadResumes.ts'
	);
};

const { GCP_STORAGE_SERVICE_ACCOUNT, BUCKET_NAME } = process.env;
if (!GCP_STORAGE_SERVICE_ACCOUNT || !BUCKET_NAME) {
	printUsage();
	process.exit(1);
}

const credentials = JSON.parse(process.env.GCP_STORAGE_SERVICE_ACCOUNT ?? '');
const storage = new Storage({ credentials });

const getResumes = async (models: Models): Promise<void[]> => {
	const cwd = process.cwd();
	const arr = await models.Hackers.find({
		status: { $in: ['ACCEPTED', 'SUBMITTED', 'CONFIRMED'] },
	})
		.map(async hacker => {
			const filename = hacker._id.toHexString();
			console.log(
				`Downloading "${hacker.lastName}, ${hacker.firstName} (${hacker.school}).pdf" for user with id ${hacker._id}`
			);

			try {
				const resume = await storage.bucket(BUCKET_NAME).file(filename);
				if (await resume.exists())
					await resume.download({
						destination: `${cwd}/resumes/${hacker.lastName}, ${hacker.firstName} (${hacker.school}).pdf`,
						decompress: true,
					});
			} catch (e) {
				console.group('Error:');
				console.error(e);
				console.info(hacker);
				console.groupEnd();
			}
		})
		.toArray();

	console.info(`Processing ${arr.length} entries.`);

	return Promise.all(arr);
};

(async (): Promise<void> => {
	const models = await new DB().collections;

	try {
		const resumeFolderPath = `${process.cwd()}/resumes`;
		if (fs.existsSync(resumeFolderPath)) {
			if (!fs.statSync(resumeFolderPath).isDirectory())
				throw Error(`${resumeFolderPath} exists and is not a directory!`);
		} else {
			fs.mkdirSync(resumeFolderPath);
		}
		if (fs.readdirSync(resumeFolderPath).length) {
			throw Error(`${resumeFolderPath} is not empty!`);
		}

		await getResumes(models);
		process.exit(0);
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
})();
