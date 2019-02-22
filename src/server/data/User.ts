import 'reflect-metadata';
import { Field, ObjectType, Int, Float } from 'type-graphql';

@ObjectType({ description: 'DTO for a generic Vaken user' })
export class User {}
