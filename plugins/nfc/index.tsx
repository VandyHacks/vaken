// import { RoutePlugin, GraphQLSchemaPlugin } from "./plugins"
import { UserType } from '../../src/client/generated/graphql';
import schema from './schema.graphql'
// import { checkInUserToEvent, removeUserFromEvent, registerNFCUIDWithUser, getUser } from './server';
import { checkIsAuthorized, checkIsAuthorizedArray, queryById } from '../../src/server/resolvers/helpers'
// import { UserInputError } from 'apollo-server-express';
import { Resolvers } from '../../src/server/generated/graphql';

export class NFCPlugin {
  get routeInfo() {
    return {
      displayText: "Test Module",
      path: "/test_module",
      authLevel: [UserType.Organizer]
    }
  }

  async component() {
    return await import('./Nfc')
  }

  get schema() {
    return schema;
  }

  // get resolvers(): Resolvers[""] {
  //   return {
  //     Query: {
  //       _PLUGIN__event: async (root, { id }, ctx) => queryById(id, ctx.models.Events),
  //     }
  //   }
  // }
}

export default {
  NFCPlugin
}