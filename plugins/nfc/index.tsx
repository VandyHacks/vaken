import React, { FunctionComponent } from 'react';
import Nfc from "./Nfc"
import { RoutePlugin, GraphQLSchemaPlugin } from "./plugins"
import { UserType } from '../../src/client/generated/graphql';
import schema from './schema.graphql'

export class NFCFrontend implements RoutePlugin, GraphQLSchemaPlugin {
  component: FunctionComponent;
  displayText: string;
  path: string;
  authLevel: [UserType];
  schema: string;

  constructor() {
    this.component = (): JSX.Element => {
      return <Nfc />
    };
    this.displayText = "Test Module";
    this.path = "/test_module"
    this.authLevel = [UserType.Organizer]
    this.schema = schema
  }
}

export default {
  NFCFrontend
}