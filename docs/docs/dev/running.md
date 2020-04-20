---
id: running
title: Running
sidebar_label: Running
---

### Setup

You will need [npm](https://github.com/npm/cli) as a package manager and build runner.

Run `./scripts/install.sh` from the top level of the Vaken repository. Note that the variables in
the new `.env` file will need to be changed to valid values

### Running the app:

You will need your own instance of MongoDB in order to run Vaken. We recommend using [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) to set up a cluster and
set the MONGODB_BASE_URL in the env file to your new connection string. In addition, we recommend getting [MongoDB Compass](https://www.mongodb.com/download-center/compass) 
to view and edit data easily.

To start up the app run:
```bash
npm run dev # runs backend + frontend, both reloading on changes
```

Now to go `localhost:8081` to see the page.
NOTE: you can also go to `localhost:8080/graphql` to see an interactive GraphQL IDE to try out queries and mutations (disabled in production env by default).

To create a production build, run `npm build`.
