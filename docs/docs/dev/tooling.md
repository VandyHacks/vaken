---
id: tooling
title: Tooling
sidebar_label: Tooling
---

## Frontend Tools

### React

- We utilize React across the application to generate frontend components, such as Buttons, Containers, Input, Loading, Sidebar, Symbol, and Text.
- These React components are located in [the components folder–src/client/components.](https://github.com/VandyHacks/vaken/tree/staging/src/client/components)

## Middleware

These tools link between our backend and frontend, helping manage authentication, queries to the backend, and more.

### GraphQL via Apollo

- We chose to utilize [GraphQL](https://graphql.org/) because of its flexibility in requesting specific information without exposing endpoints. We currently only expose an `auth` endpoint in the core application.
- Furthermore, via [GraphQL Code Generator](https://graphql-code-generator.com/), we had the ability for us to generate types for all of our possible queries, mutations, and resolvers.
- Apollo offered an excellent way of integrating with the generated types. As you may see in the `index.ts` of the `client` folder, wrapping the application with `<ApolloProvider />` lets us make use of the generated GraphQL types.
- If you are new to GraphQL, we would recommend a hands-on tutorial at [How to GraphQL](https://www.howtographql.com/), as recommended by the GraphQL team at [GraphQL.org](https://graphql.org/learn/).

### Passport

- To help us manage authentication, we utilize Passport because of its usability with a large range of OAuth providers, plus its ease of integration with Express.

## Backend

### Express

- We utilized Express because of its strong support and good integrations with our tooling and middleware, and because it suited our use case of a lightweight framework.

### MongoDB

- We utilize MongoDB in part because of past experience with MongoDB on our team, and also because we found it to work well with GraphQL.

## Dev Tools

### TypeScript

- We utilize TypeScript to ensure that things across the application are typed, ensuring that expectations are met for functions, GraphQL types, and more.

### Webpack

- We utilize Webpack to leverage dynamic imports, handle bundling, and more.
