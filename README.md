# vaken
Next-gen hacker registration system


Dev
---

```bash
npm i -g tsc # install TypeScript globally
npm i # install all dependencies

npm start # start server no autoreload
npm run dev # start server w/ autoreload

npm run lint # check linting errors
npm run lint-fix # lints, and autofixes for some rules
```

Code structure
---
* `/dist` - output of `tsc` build
* `/src` - main server code
    * `/auth` auth helpers
    * `/email` email sending
    * `/events` manage events at hackathon
    * `/settings` admin settings
    * `/stats` admin statistics about users
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

[Koa](https://koajs.com/) - made by the guys that made Express.js, but with async/await and ES7, as well as more modular plugin structure. See [Koa vs Express](https://github.com/koajs/koa/blob/master/docs/koa-vs-express.md).

[MongoDB](https://www.npmjs.com/package/mongodb) - A NoSQL database that is easy to use with JavaScript, due to its ability to basically store JSON (JavaScript objects) directly.

[Mongoose](https://mongoosejs.com/) - The most popular ORM for MongoDB. It is a much easier way to do DB operations than raw Mongo queries, and allows DB schemas/models to be more easily written and enforced.

[Typegoose](https://github.com/szokodiakos/typegoose) - A TypeScript wrapper on top of Mongoose, so that we wouldn't have to specify models in two places, reducing redundancy. Works by using [reflect-metadata](https://www.npmjs.com/package/reflect-metadata). See [motivation](https://github.com/szokodiakos/typegoose#motivation).

[simple-oauth2](https://www.npmjs.com/package/simple-oauth2) - may change, for OAuth2 (eg. Github or Google SSO login). Should result in more readable + maintainable code than implementing an ad-hoc OAuth2 client from scratch.

[koa-router](https://www.npmjs.com/package/koa-joi-router) - Just gets the job done, nothing fancy. It is possible to use regex for defining routes (see https://github.com/pillarjs/path-to-regexp).

[koa-helmet](https://www.npmjs.com/package/koa-helmet) - Koa's version of [helmet](https://www.npmjs.com/package/helmet), which provides some good server-side security default configurations for web apps.


NOTE: (don't need Webpack or Babel b/c `tsc` can handle es6 and stuff)