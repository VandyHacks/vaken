import 'reflect-metadata';
import { ObjectType } from 'type-graphql';

import User from './User';

@ObjectType({ description: 'DTO for a Vaken organizer' })
class Organizer extends User {}

export default Organizer;

// Copyright (c) 2019 Vanderbilt University
