// import { RoutePlugin, GraphQLSchemaPlugin } from "./plugins"
import { UserType, _Plugin__EventDbObject, _Plugin__EventCheckInDbObject } from '../../src/client/generated/graphql';
import schema from './nfcSchema.graphql'
// import { checkInUserToEvent, removeUserFromEvent, registerNFCUIDWithUser, getUser } from './server';
import { checkIsAuthorized, checkIsAuthorizedArray, queryById } from '../../src/server/resolvers/helpers'
// import { UserInputError } from 'apollo-server-express';
import { CustomResolvers } from '../../src/server/resolvers';
import Context from '../../src/server/context';

interface test {
  Query: CustomResolvers<Context>["Query"];
  _PLUGIN__Event: CustomResolvers<Context>["_PLUGIN__Event"];
  _PLUGIN__EventCheckIn: CustomResolvers<Context>["_PLUGIN__EventCheckIn"];
}
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

  addCollectionToModel() {

  }

  get resolvers(): test {
    return {
      _PLUGIN__Event: {
        attendees: async event => (await event).attendees || [],
        checkins: async event => (await event).checkins || [],
        description: async event => (await event).description || null,
        duration: async event => (await event).duration,
        eventType: async event => (await event).eventType,
        id: async event => (await event)._id.toHexString(),
        location: async event => (await event).location,
        name: async event => (await event).name,
        startTimestamp: async event => (await event).startTimestamp.getTime(),
        warnRepeatedCheckins: async event => (await event).warnRepeatedCheckins,
        gcalID: async event => (await event).gcalID || null,
        // owner: async event => (await event).owner || null,
      },
      _PLUGIN__EventCheckIn: {
        id: async eventCheckIn => (await eventCheckIn)._id.toHexString(),
        timestamp: async eventCheckIn => (await eventCheckIn).timestamp.getTime(),
        user: async eventCheckIn => (await eventCheckIn).user,
      },
      Query: {
        _PLUGIN__event: async (root, { id }, ctx) => {
          return queryById(id, ctx.db.collection<_Plugin__EventDbObject>('_PLUGIN__events'));
        },
        _PLUGIN__events: async (root, args, ctx) => {
          // const user = checkIsAuthorizedArray([UserType.Organizer, UserType.Sponsor], ctx.user);
          // // if (user.userType === UserType.Sponsor) {
          // //   // const { _id } = (user as SponsorDbObject).company;
          // //   const events = await ctx.models.Events.find({ 'owner._id': new ObjectID(_id) }).toArray();
          // //   return events;
          // // }
          // if (user.userType === UserType.Organizer) {
          //   return ctx.db.collection<_Plugin__EventDbObject>('_PLUGIN__events').find().toArray();
          // }
          return ctx.db.collection<_Plugin__EventDbObject>('_PLUGIN__events').find({ owner: null }).toArray();
        },
        _PLUGIN__eventCheckIn: async (root, { id }, ctx) =>
          queryById(id, ctx.db.collection<_Plugin__EventCheckInDbObject>('_PLUGIN__eventCheckIns')),
        _PLUGIN__eventCheckIns: async (root, args, ctx) => {
          // checkIsAuthorizedArray([UserType.Organizer], ctx.user);
          return ctx.db.collection<_Plugin__EventCheckInDbObject>('_PLUGIN__eventCheckIns').find().toArray();
        },
      }
    }
  }
}

export default {
  NFCPlugin
}