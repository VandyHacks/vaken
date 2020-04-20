---
id: overview
title: Plugins Overview
sidebar_label: Overview
---

## What are plugins?

Plugins are well-defined sets of features that may be integrated with Vaken. These include things such as certain OAuth libraries, NFC, sponsor management, and Google Calendar event syncing, which also integrates with NFC.

## Why plugins?

Plugins allow users to customize Vaken to their use case, and easily extend Vaken without having to heavily directly code within Vaken.

## Plugin Patterns

We use the **builder pattern** to generate a package when it is needed rather than exporting the plugin from the nppm package itself. This means that we invoke the package as a function in the `plugins` folder, and export `authPlugins` and `serverPlugins` from different `plugins.ts` files.

## Auth Plugins vs. Server Plugins

We have two patterns of integrating plugins with Vaken, which stems from how our authentication works. Since we use Passport to help us authenticate, then plugins that deal with authentication must hook into the server directly with Passport. In comparison, server plugins need to add resolvers, schema, etc. to the server, and follow different patterns on the frontend.

## Client vs. Server Plugins

The server and client follow different patterns for integration, as we wanted to ensure that things such as environment variables could not be traced. Therefore, the [client folder](../../../src/client/) has its own `plugins.ts` file, and the [server folder](../../../src/server) also has its own `plugins.ts` file. Both of these import plugins from the `plugins folder` at the root of the application folder.

### Frontend

The server plugins need to generate a frontend component, e.g. in the example of NFC, there needs to be a frontend NFC component so that organizers can check hackers in to events.

In contrast, the auth plugins need to export their name, displayName, and logo. The name is used for auth routes, while the display name is used for the frontend name, and the logo is used for the frontend button.

### Backend

Server plugins need to export their schema and resolvers so that the server can use it. Auth plugins need to export an OAuth package that takes in a `CLIENT_ID`, `CLIENT_SECRET`, and `CALLBACK_URL`, plus the `processOAuthCallback` function that will get the callback from the OAuth strategy.

## Installation

Our plugins are distributed on npm, under the organization [@vandyhacks](https://www.npmjs.com/org/vandyhacks). In order to use them, first `npm i <packagename>`. Next, we will demonstrate an example on a specific plugin.

### Example

For simplicity of making an example, we will demonstrate how to use the [@vandyhacks/github-oauth](https://www.npmjs.com/package/@vandyhacks/github-oauth) package.
