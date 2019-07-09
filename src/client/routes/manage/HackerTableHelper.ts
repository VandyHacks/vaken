import { HackersQuery } from '../../generated/graphql';

type ArrayType<T> = T extends (infer U)[] ? U : never;
type QueriedHacker = ArrayType<HackersQuery['hackers']>;

// maps the radio slider labels to the hacker status
const processSliderInput = (input: string): ApplicationStatus => {
	switch (input.toLowerCase()) {
		case 'accept':
			return ApplicationStatus.Accepted;
		case 'reject':
			return ApplicationStatus.Rejected;
		case 'undecided':
		default:
			return ApplicationStatus.Submitted;
	}
};

export default {
	QueriedHacker,
	processSliderInput,
};
