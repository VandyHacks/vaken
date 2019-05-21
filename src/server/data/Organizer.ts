import 'reflect-metadata';
import { ObjectType } from 'type-graphql';

import User from './User';

@ObjectType({ description: 'DTO for a Vaken organizer' })
export default class Organizer extends User {}
