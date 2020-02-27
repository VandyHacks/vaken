import { UserType, _Plugin__EventDbObject, _Plugin__EventCheckInDbObject } from '../../src/client/generated/graphql';
import schema from './schema.graphql'
import { checkIsAuthorized, checkIsAuthorizedArray, queryById } from '../../src/server/resolvers/helpers'
import { UserInputError } from 'apollo-server-express';
import { checkInUserToEvent, removeUserFromEvent, registerNFCUIDWithUser, getUser } from './helpers';
import { Resolvers } from '../../src/server/generated/graphql'
import Context from '../../src/server/context';

export class NFCPlugin {
  get schema() {
    return schema;
  }

  get resolvers(): Pick<Resolvers<Context>, "Mutation" | "Query" | "_Plugin__Event" | "_Plugin__EventCheckIn"> {
    return {
      _Plugin__Event: {
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
      _Plugin__EventCheckIn: {
        id: async eventCheckIn => (await eventCheckIn)._id.toHexString(),
        timestamp: async eventCheckIn => (await eventCheckIn).timestamp.getTime(),
        user: async eventCheckIn => (await eventCheckIn).user,
      },
      Query: {
        _Plugin__event: async (root, { id }, ctx) => {
          return queryById(id, ctx.db.collection<_Plugin__EventDbObject>('_Plugin__events'));
        },
        _Plugin__events: async (root, args, ctx) => {
          const user = checkIsAuthorizedArray([UserType.Organizer, UserType.Sponsor], ctx.user);
          // // if (user.userType === UserType.Sponsor) {
          // //   // const { _id } = (user as SponsorDbObject).company;
          // //   const events = await ctx.models.Events.find({ 'owner._id': new ObjectID(_id) }).toArray();
          // //   return events;
          // // }
          if (user.userType === UserType.Organizer) {
            return ctx.db.collection<_Plugin__EventDbObject>('_Plugin__events').find().toArray();
          }
          return ctx.db.collection<_Plugin__EventDbObject>('_Plugin__events').find({ owner: null }).toArray();
        },
        _Plugin__eventCheckIn: async (root, { id }, ctx) =>
          queryById(id, ctx.db.collection<_Plugin__EventCheckInDbObject>('_Plugin__eventCheckIns')),
        _Plugin__eventCheckIns: async (root, args, ctx) => {
          checkIsAuthorizedArray([UserType.Organizer], ctx.user);
          return ctx.db.collection<_Plugin__EventCheckInDbObject>('_Plugin__eventCheckIns').find().toArray();
        },
      },
      Mutation: {
        _Plugin__checkInUserToEventByNfc: async (root, { input }, { models, user }) => {
          checkIsAuthorizedArray([UserType.Organizer, UserType.Volunteer, UserType.Sponsor], user);
          const inputUser = await getUser(input.nfcId, models);
          if (!inputUser) throw new UserInputError(`user with nfc id <${input.nfcId}> not found`);
          return checkInUserToEvent(inputUser._id.toString(), input.event, models);
        },
        _Plugin__removeUserFromEvent: async (root, { input }, { models, user }) => {
          checkIsAuthorizedArray([UserType.Organizer, UserType.Volunteer, UserType.Sponsor], user);
          return removeUserFromEvent(input.user, input.event, models);
        },
        _Plugin__removeUserFromEventByNfc: async (root, { input }, { models, user }) => {
          checkIsAuthorizedArray([UserType.Organizer, UserType.Volunteer, UserType.Sponsor], user);
          const inputUser = await getUser(input.nfcId, models);
          if (!inputUser) throw new UserInputError(`user with nfc Id ${input.nfcId} not found`);
          return removeUserFromEvent(inputUser._id.toString(), input.event, models);
        },
        _Plugin__registerNFCUIDWithUser: async (root, { input }, { models, user }) => {
          checkIsAuthorized(UserType.Organizer, user);
          return registerNFCUIDWithUser(input.nfcid, input.user, models);
        },
        _Plugin__checkInUserToEvent: async (root, { input }, { models, user }) => {
          checkIsAuthorizedArray([UserType.Organizer, UserType.Volunteer, UserType.Sponsor], user);
          return checkInUserToEvent(input.user, input.event, models);
        },
      }
    }
  }
}

export default {
  NFCPlugin
}