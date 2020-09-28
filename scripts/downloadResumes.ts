import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import { promisify } from 'util';
import DB, { Models } from '../src/server/models';

const rename = promisify(fs.rename);

const printUsage = (): void => {
	// eslint-disable-next-line no-console
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
			console.log(`Getting resume for ${filename} (${hacker.lastName}, ${hacker.firstName}).pdf`);
			await storage
				.bucket(BUCKET_NAME)
				.file(filename)
				.download({ destination: `${cwd}/resumes`, decompress: true });

			console.log(
				`Renaming '${filename}' to '${hacker.lastName}, ${hacker.firstName} (${hacker.school}).pdf'`
			);
			return rename(
				`${cwd}/resumes/${filename}`,
				`${cwd}/resumes/${hacker.lastName}, ${hacker.firstName} (${hacker.school})`
			);
		})
		.toArray();

	console.info(`Processing ${arr.length} entries.`)

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
		// eslint-disable-next-line no-console
		console.error(e);
		process.exit(1);
	}
})();
