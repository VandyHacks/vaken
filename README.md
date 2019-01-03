# vaken
Next-gen hacker registration system


Dev
---

#### Setting up a database for testing locally
First, create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and read the [getting-started guide](https://docs.atlas.mongodb.com/getting-started/). This will allow you to set up a database without downloading and installing MongoDB locally.

```bash
npm run setup # runs setup script
```

#### Installing dependencies
```bash
npm i -g tsc # install TypeScript globally
npm i # install all dependencies
```

#### Running
```bash
npm start # start server no autoreload
npm run dev # start server w/ autoreload (recommended for dev)
```

#### Other commands
```bash
npm test # runs tests
npm run lint # check linting errors
npm run lint-fix # lints, and autofixes for some rules
npm run typecheck # runs type checks
npm run format # autoformats code according to style guide
```

Code structure
---
* `/config` - for hackathon-specific config files
* `/dist` - output of `tsc` build
* `/docs` - folder to host public website version of documentation
* `/src` - main server code
    * `/auth` auth helpers
    * `/email` email sending
    * `/events` manage events at hackathon
    * `/settings` admin settings
    * `/stats` admin statistics about users
    * `/types` - Type declarations stubs for libs that don't officially have them.
    * `/users` code for users
* `/test` - tests


Dev Tooling
---

* [ts-node-dev](https://github.com/whitecolor/ts-node-dev) - server autoreloading on changes, saves a lot of time compared to manually restarting the server each time a tiny bit of code is changed. It is much faster than `node-dev` + `ts-node`, and also faster than `nodemon` due to better caching of results.

* [ts-node](https://github.com/TypeStrong/ts-node) - Compiles and runs app (is basically `tsc` + `node`), without server reload.

* [tslint](https://www.npmjs.com/package/tslint) + [tslint-config-airbnb](https://www.npmjs.com/package/tslint-config-airbnb) - linting, is TypeScript's equivalent of `eslint`, to enforce best code practices. The AirBnB config was chosen because it's pretty standard and has nice defaults. Config stored in `tslint.json`.

* [prettier](https://www.npmjs.com/package/prettier) + [tslint-prettier](https://www.npmjs.com/package/tslint-config-prettier)- pretty standard code formatting favoring convention over configuration, see [philosophy](https://alexjover.com/blog/use-prettier-with-tslint-and-be-happy/), to ensure all code is consistently formatted throughout the repo.


* [husky](https://github.com/typicode/husky) - precommit hooks + prepush hooks (see `package.json`) in order to run formatting/linting/compiling before code is committed or pushed, to maintain code quality.

* [lint-staged](https://www.npmjs.com/package/lint-staged) - automatically fixes linting errors and formatting errors, and amends your commit automatically. Works in conjunction with `husky`.


Tech decisions
---

[TypeScript](https://www.typescriptlang.org/) - like JavaScript, but with types + classes/OOP, so it's more maintainable and creates easier to understand code.

[Koa](https://koajs.com/) - made by the guys that made Express.js, but with async/await and ES7, as well as more modular plugin structure. See [Koa vs Express](https://github.com/koajs/koa/blob/master/docs/koa-vs-express.md). Also, it is similar usage-wise to Express, which is why we chose it instead of other frameworks like Hapi, LoopBack, etc.

[MongoDB](https://www.npmjs.com/package/mongodb) - A NoSQL database that is easy to use with JavaScript, due to its ability to basically store JSON (JavaScript objects) directly.

[Mongoose](https://mongoosejs.com/) - The most popular ORM for MongoDB. It is a much easier way to do DB operations than raw Mongo queries, and allows DB schemas/models to be more easily written and enforced.

[Typegoose](https://github.com/szokodiakos/typegoose) - A TypeScript wrapper on top of Mongoose, so that we wouldn't have to specify models in two places, reducing redundancy. Works by using [reflect-metadata](https://www.npmjs.com/package/reflect-metadata). See [motivation](https://github.com/szokodiakos/typegoose#motivation).

[simple-oauth2](https://www.npmjs.com/package/simple-oauth2) - may change, for OAuth2 (eg. Github or Google SSO login). Should result in more readable + maintainable code than implementing an ad-hoc OAuth2 client from scratch.

[koa-router](https://www.npmjs.com/package/koa-joi-router) - Just gets the job done, nothing fancy. It is possible to use regex for defining routes (see https://github.com/pillarjs/path-to-regexp).

[koa-helmet](https://www.npmjs.com/package/koa-helmet) - Koa's version of [helmet](https://www.npmjs.com/package/helmet), which provides some good server-side security default configurations for web apps.

[koa-jwt](https://www.npmjs.com/package/koa-jwt) - for JWT (username/password) user auth, uses [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) under the hood.

[bunyan-logger](https://github.com/koajs/bunyan-logger) - Koa-specific thin wrapper around [bunyan](https://github.com/trentm/node-bunyan). Logs URL route info on each server request in machine-parseable JSON format.


### Testing

[supertest](https://github.com/visionmedia/supertest) - for testing API by simulating HTTP requests, works in conjunction with Jest.

[jest](https://jestjs.io/) - nice widely used testing framework. Config is in [./jest.config.js](./jest.config.js). NOTE: The TypeScript tests are also recompiled for commit hooks, but not for server reload.

NOTE: (don't need Webpack or Babel b/c `tsc` can handle es6 and stuff)



---
Run `fiddly` to deploy this README to the [docs site](https://vandyhacks.github.io/vaken/). Created via [SaraVieira/fiddly](https://github.com/SaraVieira/fiddly) (`npm i -g fiddly` if you haven't already).