# vaken
Next-gen hacker registration system


Dev
---
Made with [TypeScript](https://www.typescriptlang.org/) :)

TypeScript config inspired by [TypeScript-Node-Starter](https://github.com/Microsoft/TypeScript-Node-Starter)
(don't need Webpack or Babel b/c `tsc` and `node` can handle es6 and stuff), except stricter (`"strict": true`)

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
    * `/controllers` api
    * `/models` db ORM models
* `/test` - tests


Tooling
---

* [nodemon](https://nodemon.io/) - server autoreloading on changes
* [ts-node](https://github.com/TypeStrong/ts-node) ensures `nodemon` won't crash when typescript doesn't compile...
* [tslint](https://www.npmjs.com/package/tslint) + [tslint-config-airbnb](https://www.npmjs.com/package/tslint-config-airbnb) instead of `eslint` - linting
* [prettier](https://www.npmjs.com/package/prettier) + [tslint-prettier](https://www.npmjs.com/package/tslint-config-prettier)- code formatting, see [philosophy](https://alexjover.com/blog/use-prettier-with-tslint-and-be-happy/)
* [husky](https://github.com/typicode/husky) - precommit hooks + prepush hooks (see `package.json`)
