---
id: auth
title: Authentication
sidebar_label: Authentication
---

## Overview

Our authentication is centered around OAuth, and `UserTypes` that are associated with certain users. These consist of `Hacker`, `Organizer`, `Sponsor`, and `Volunteer` types. Each of these correspond to the ability to see different pages and have different functionality.

## User Types

### Hacker Type

- Allows user to start and submit an application, and does not allow access to any other page.

### Organizer Type

- Allows user to view the hacker table, check in users via NFC, manage events, and manage sponsors.
- In order to make a user an organizer type, this can either be changed via a script or be changed manually.
  - In the [scripts folder](../../../scripts/makeOrganizer.ts), the [makeOrganizer](../../../scripts/makeOrganizer.ts) script can be used like this: `ts-node -r dotenv/config ./scripts/makeOrganizer.ts -- YOUR_EMAIL@FOO.COM,BEN@FOO.COM [github | google]`. This example works for multiple organizers at once.
    - Here is an example of using the script on a single user: `ts-node -r dotenv/config ./scripts/makeOrganizer.ts -- YOUR_EMAIL@FOO.COM github`
  - In order to change it manually, it may be updated in the database by changing UserTypes to `ORGANIZER` and inserting their information in the Organizers collection.
    - We would recommend against this, as it may lead to some errors inadvertently.

### Sponsor Type

- Allows users to view hacker resumes and check in via NFC to sponsor events.
- The auth level for sponsors may be granted from the UI for `Organizers`–there is a `Sponsors` tab in the sidebar that allows organizers to enter the email of sponsors. Then, the next time that the sponsor logs in with that email, they will have Sponsor-level privileges.

### Volunteer Type

- Allows the user to Scan NFC and access the list of upcoming events.
- Similar to the `Organizer` type, `Volunteer` types may be generated via the [makeVolunteer script](../../../scripts/makeVolunteer.ts) in exactly the same way as above.

## AuthContext

The AuthContext is utilized in the [index.ts of the client](https://github.com/VandyHacks/vaken/blob/staging/src/client/app.tsx). By default, it will make users the `Hacker` type.

### How does AuthContext work?
