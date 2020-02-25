// import { RoutePlugin, GraphQLSchemaPlugin } from "./plugins"
import { UserType } from '../../src/client/generated/graphql';
import schema from './nfcSchema.graphql'
// import { checkInUserToEvent, removeUserFromEvent, registerNFCUIDWithUser, getUser } from './server';
import { checkIsAuthorized, checkIsAuthorizedArray, queryById } from '../../src/server/resolvers/helpers'
// import { UserInputError } from 'apollo-server-express';
import { CustomResolvers } from '../../src/server/resolvers';
import Context from '../../src/server/context';

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

  get resolvers() {
    const query: CustomResolvers<Context>["Query"] = {
      _PLUGIN__event: async (root, { id }, ctx) => {
        return queryById(id, ctx.models._PLUGIN__Events)
      }
    }

    return {
      Query: query
    }
  }
}

export default {
  NFCPlugin
}