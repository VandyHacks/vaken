---
id: graphql_and_mongodb
title: GraphQL and MongoDB
sidebar_label: GraphQL and MongoDB
---

### General Architecture

Schemas:

- [./src/common/schema.graphql.ts](./src/common/schema.graphql.ts) - main schema, shared among server and client
- [./src/client/routes/team/teams.graphql.ts](./src/client/routes/team/teams.graphql.ts) - team data
- [./src/client/routes/profile/user.graphql.ts](./src/client/routes/profile/user.graphql.ts) - for a specific user
- [./src/client/routes/manage/hackers.graphql.ts](./src/client/routes/manage/hackers.graphql.ts) - hacker table
- [./src/client/me.graphql.ts](./src/common/schema.graphql.ts) - personal logged in user

Models:
In [./src/server/models.ts](./src/server/models.ts)

Resolvers:
In [./src/server/resolvers.ts](./src/server/resolvers.ts)
