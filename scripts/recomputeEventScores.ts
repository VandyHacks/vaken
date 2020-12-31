import { FilterQuery } from 'mongodb';
import { EventDbObject, HackerDbObject } from '../src/server/generated/graphql';
import DB, { Models } from '../src/server/models';

const printUsage = (): void => {
	void console.log(
		'Usage: npx ts-node -r dotenv/config ./scripts/downloadResumes.ts -- [--updatedb]'
	);
};

const getComputedHackerEventScore = (hacker: HackerDbObject, events: EventDbObject[]): number =>
	events.reduce(
		(acc, event) =>
			hacker.eventsAttended.includes(event._id.toHexString()) ? acc + (event.eventScore ?? 0) : acc,
		0
	);

const printHackerScoreStats = (hacker: HackerDbObject, events: EventDbObject[]): void => {
	console.group(`Hacker ${hacker.firstName} ${hacker.lastName} (${hacker.email})`);
	console.log('# Events Attended: ', hacker.eventsAttended.length);
	console.log('Hacker score: ', hacker.eventScore);
	console.log('Computed hacker score: ', getComputedHackerEventScore(hacker, events));
	console.groupEnd();
};

const recomputeHackerEventScores = async (
	models: Models,
	writeResultsToDB = false
): Promise<void> => {
	let bestScore = 0;
	let bestHacker: HackerDbObject[] = [];
	try {
		const [events, hackersToRecompute] = await Promise.all([
			models.Events.find().toArray(),
			models.Hackers.find(({
				eventsAttended: { $not: { $size: 0 } },
			} as unknown) as FilterQuery<HackerDbObject>).toArray(),
		]);
		hackersToRecompute.forEach(hacker => {
			printHackerScoreStats(hacker, events);
			const hackerScore = getComputedHackerEventScore(hacker, events);
			if (hackerScore > bestScore) {
				bestScore = hackerScore;
				bestHacker = [hacker];
			} else if (hackerScore === bestScore) {
				bestHacker.push(hacker);
			}
		});
		if (writeResultsToDB) {
			console.group('Writing results to DB:');
			console.log(`Updating ${hackersToRecompute.length} hacker objects...`);
			const writeResult = await Promise.all(
				hackersToRecompute.map(hacker =>
					models.Hackers.findOneAndUpdate(
						{ _id: hacker._id },
						{ $set: { eventScore: getComputedHackerEventScore(hacker, events) } },
						{ returnOriginal: false }
					)
				)
			);
			console.log(
				writeResult
					.reduce(
						(acc, result) => (result.ok ? acc : [...acc, result.lastErrorObject]),
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						[] as any[]
					)
					.toString()
			);
			console.groupEnd();
		} else {
			console.log('\nNot writing to db');
		}

		console.group('\n\nHacker eventScore stats:');
		console.log('# Hackers checking into events: ', hackersToRecompute.length);
		console.group('Winning hackers:');
		bestHacker.forEach(hacker => printHackerScoreStats(hacker, events));
		console.groupEnd();
		console.groupEnd();
	} catch (e) {
		console.group('Error:');
		console.error(e);
		console.groupEnd();
	}
};

(async (): Promise<void> => {
	const models = await new DB().collections;

	const args = process.argv.splice(process.execArgv.length);

	try {
		await recomputeHackerEventScores(models, /* writeResultsToDB */ args[0] === '--updatedb');
		process.exit(0);
	} catch (e) {
		console.error(e);
		printUsage();
		process.exit(1);
	}
})();
