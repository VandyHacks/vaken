import { Field, InputType } from 'type-graphql';
import Hacker from '../data/Hacker';

@InputType()
class UpdateHackerInput implements Partial<Hacker> {}

export default UpdateHackerInput;
