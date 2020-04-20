---
id: nfc_and_events
title: NFC and Events
sidebar_label: NFC and Events

## Data specifications

### Events Collection
We require a Events collection to store Event documents. Each document represents an unique Event and have the following fields for basic functionality:
- name: String indicating the name of the Event.
- startTimestamp: Date indicating when the Event starts.
- duration: Int indicating Event length in minutes.
- attendees: Array of <user_identifier> indicating the Users who are the current attendees of an Event. Contains no duplicates.
- checkIns: Array of <user_identifier> indicating each Users’ check-in attempts into an Event. May contain duplicates.
- warnRepeatedCheckIns: Boolean indicating whether an Event should allow the same User to check in multiple times. This is only used to warn the Organizer that a User is in the attendees array and does not prevent the check-in from being recorded in checkIns.
- description: String indicating description of Event. Optional.
- location: String indicating location of Events. 
- eventType: String indicating the type of Event.

### User Documents
User documents use these fields:
eventsAttended (new): Array of <event_identifier> indicating which events a User has checked into. Contains no duplicates.

## Backend Implementation
These functions implement the resolvers and are located in `./src/server/nfc/index.ts`

```md
isNFCUIDAvailable(nfcUID) => boolean
- Return false IFF nfcId is the active NFC UID for any User.

registerNFCUIDWithUser(nfcUID, user)
- Check nfcUID availability.
- Push nfcUID onto the end of the user.secondaryIds array.

getNFCUID(user) => nfcUID
- Return the nfcUID at the end of the user.secondaryIds array or null.

getUser(nfcUID) => user
- Return a user who has nfcUID as their active one or null.

removeUserFromEvent(user, event)
- Checks/Updates event.attendees array to no longer contain user.

checkInUserToEvent(user, event)
- Push user to end of event.checkIns array
- Checks/Updates event.attendees array to contain user.
- Checks/Updates user.eventsAttended array to contain event.

shouldWarnRepeatedCheckIn(user, event) => boolean
- Return true IFF event.attendees array contains user and event.warnRepeatedCheckIns is true

getEventsAttended(user) => Array<event_identifier>
- Return user.eventsAttended

getAttendees(event) => Array<user_identifier>
- Return event.attendees
```
