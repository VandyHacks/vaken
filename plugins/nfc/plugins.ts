import { UserType } from '../../src/client/generated/graphql';
import { FunctionComponent } from 'react';

export interface RoutePlugin {
  authLevel: [UserType];
  component: FunctionComponent;
  displayText: string;
  path: string;
}

export interface GraphQLSchemaPlugin {
  schema: string;
}