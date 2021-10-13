import * as fs from 'fs';
import { FilterQuery } from 'mongodb';
import { EventDbObject, HackerDbObject } from '../src/server/generated/graphql';
import DB, { Models } from '../src/server/models';

const printUsage = (): void => {
	void console.log(
		'Usage: npx ts-node -r dotenv/config ./scripts/recomputeEventScores.ts -- [--updatedb] [--showonlydiffs]'
	);
};

const printSortedEventScores = (hackers: HackerDbObject[], writeToFile: boolean): void => {
	console.group(`\n\nSorted Hacker List`);
	const file = fs.openSync('./sorted.csv', 'w');
	const eventScores: number[] = [];
	hackers.forEach(hacker => {
		console.log(`Hacker ${hacker.firstName} ${hacker.lastName} (${hacker.email})`);
		console.log(`Hacker score: ${hacker.eventScore}`);
		eventScores.push(hacker.eventScore);
		const hackerData = `${hacker._id},${hacker.firstName},${hacker.lastName},${hacker.email},${hacker.eventScore},${hacker.shirtSize},${hacker.userType}\n`;
		if (writeToFile) {
			fs.writeFileSync(file, hackerData);
		}
	});
	fs.close(file, err => console.log(err));
	console.groupEnd();
	console.group(`\n\nRandom stats idk`);
	console.log(`- # of hackers: ${eventScores.length}`);
	console.log(`- Minimum value: ${eventScores[0]}`);
	console.log(`- Maximum value: ${eventScores[eventScores.length - 1]}`);
	const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);
	const eventScoresSum = sum(eventScores);
	const mean = eventScoresSum / eventScores.length;
	console.log(`- Mean value: ${mean}`);
	const diffArr = eventScores.map(a => (a - mean) ** 2);
	const stddev = Math.sqrt(sum(diffArr) / (eventScores.length - 1));
	console.log(`- Standard deviation: ${stddev}`);
	const quantile = (arr: number[], q: number): number => {
		const pos = (eventScores.length - 1) * (q / 100);
		const base = Math.floor(pos);
		const rest = pos - base;
		if (eventScores[base + 1] !== undefined) {
			return eventScores[base] + rest * (eventScores[base + 1] - eventScores[base]);
		} else {
			return eventScores[base];
		}
	};
	const median = quantile(eventScores, 50);
	console.log(`- Median: ${median}`);
	const percentile25 = quantile(eventScores, 25);
	console.log(`- 25th percentile: ${percentile25}`);
	const percentile75 = quantile(eventScores, 75);
	console.log(`- 75th percentile: ${percentile75}`);
	console.groupEnd();
};

const getComputedHackerEventScore = (hacker: HackerDbObject, events: EventDbObject[]): number =>
	events.reduce(
		(acc, event) =>
			hacker.eventsAttended.includes(event._id.toHexString()) ? acc + (event.eventScore ?? 0) : acc,
		0
	);

const printHackerScoreStats = (
	hacker: HackerDbObject,
	events: EventDbObject[],
	showOnlyDiffs: boolean
): void => {
	const computedHackerScore = getComputedHackerEventScore(hacker, events);
	if (hacker.eventScore !== computedHackerScore || !showOnlyDiffs) {
		console.group(`Hacker ${hacker.firstName} ${hacker.lastName} (${hacker.email})`);
		console.log('# Events Attended: ', hacker.eventsAttended.length);
		console.log('Hacker score: ', hacker.eventScore);
		console.log('Computed hacker score: ', getComputedHackerEventScore(hacker, events));
		console.groupEnd();
	}
};

const recomputeHackerEventScores = async (
	models: Models,
	writeResultsToDB = false,
	showOnlyDiffs = false,
	printSorted = false
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
		console.log('Only showing Hacker score diffs');
		hackersToRecompute.forEach(hacker => {
			printHackerScoreStats(hacker, events, showOnlyDiffs);
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
		console.log('# Winning hackers: ', bestHacker.length);
		console.group('Winning hackers:');
		bestHacker.forEach(hacker => printHackerScoreStats(hacker, events, false));
		console.groupEnd();
		console.groupEnd();

		if (printSorted) {
			console.log('\n\nHackers sorted');
			hackersToRecompute.sort((first, second) => first.eventScore - second.eventScore);
			printSortedEventScores(hackersToRecompute, true);
		}
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
		await recomputeHackerEventScores(
			models,
			/* writeResultsToDB */ args.includes('--updatedb'),
			/* onlyShowHackersWithDifferentScores */ args.includes('--showonlydiffs'),
			/* printSortedList */ args.includes('--printsorted')
		);
		process.exit(0);
	} catch (e) {
		console.error(e);
		printUsage();
		process.exit(1);
	}
})();
