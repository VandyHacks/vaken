---
id: auth
title: Authentication
sidebar_label: Authentication
---

## Overview

Our authentication is centered around OAuth, and `UserTypes` that are associated with certain users. These consist of `Hacker`, `Organizer`, and `Sponsor`. Each of these correspond to the ability to see different pages and have different functionality.

## User Types

### Hacker Type

- Allows user to start and submit an application, and does not allow access to any other page.

### Organizer Type

- Allows user to view the hacker table, check in users via NFC, manage events, and manage sponsors.

### Sponsor Type

- Allows users to view hacker resumes and check in via NFC to sponsor events.

## AuthContext

The AuthContext is utilized in the [index.ts of the client](https://github.com/VandyHacks/vaken/blob/staging/src/client/app.tsx). By default, it will make users the `Hacker` type.

### How does AuthContext work?
