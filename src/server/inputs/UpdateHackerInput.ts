import { Field, InputType } from 'type-graphql';
import Hacker from '../data/Hacker';
import Status from '../enums/Status';
import Ethnicity from '../enums/Ethnicity';
import Race from '../enums/Race';

/**
 * Class representing a data object with updates to an existing Hacker.
 * Separate from User because all updates are strictly optional when
 * the appropriate HackerResolver mutation is invoked; only the data
 * to be updated needs to be sent to the Resolver.
 */
@InputType()
class UpdateHackerInput implements Partial<Hacker> {
	// Index signature
	[key: string]: any;

	@Field({ nullable: true })
	public status?: Status;

	@Field({ nullable: true })
	public school?: string;

	@Field({ nullable: true })
	public gradYear?: string;

	@Field({ nullable: true })
	public ethnicity?: Ethnicity;

	@Field(() => [Race], { nullable: true })
	public race?: Race[];

	@Field(() => [String], { nullable: true })
	public majors?: string[];

	@Field({ nullable: true })
	public adult?: boolean;

	@Field({ nullable: true })
	public firstHackathon?: boolean;

	@Field({ nullable: true })
	public volunteer?: boolean;

	@Field({ nullable: true })
	public github?: string;

	@Field({ nullable: true })
	public linkedin?: string;

	@Field({ nullable: true })
	public devpost?: string;

	@Field({ nullable: true })
	public website?: string;

	@Field(() => [String], { nullable: true })
	public essays?: string[];

	@Field({ nullable: true })
	public codeOfConduct?: boolean;

	@Field({ nullable: true })
	public needsReimbursement?: boolean;

	@Field({ nullable: true })
	public lightningTalk?: boolean;

	@Field({ nullable: true })
	public teamCode?: string;

	@Field({ nullable: true })
	public walkin?: boolean;

	@Field({ nullable: true })
	public teamName?: string;
}

export default UpdateHackerInput;
