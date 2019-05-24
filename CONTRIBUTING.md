# Contributing

Guide for contributors


### Setup

> TODO: put all this in an install.sh

Copying over environment variables:
```bash
cp .env.template .env # copy over to .env file
```
Then change the variables in the `.env` file to the correct values.


Installing dependencies:
```bash
npm i # install local dependencies
npm i -g nodemon webpack webpack-cli typescript ts-node # install global dependencies
```

### Running the app:

```bash
npm run dev-server # start backend first
npm start # runs frontend with hot reload using Webpack Dev Server
```

### Testing

We use Jest for testing. Snapshot testing is mostly for frontend, while mocking is preferable for backend.
Our local jest tests use the `--only-changed` option, which runs tests only for files that are actually changed, to speed up testing. NOTE: the CI will run all the tests regardless.

Running tests
```bash
npm t # runs tests with coverage
```

### Linting

We use Eslint for linting. The linting tests are cached with the `--cache` option.

client config: `./src/client/eslintrc.js`
server config: `./src/server/eslintrc.js`
general config: `./eslintrc.js`


```bash
npm run lint-check # runs the linter
npm run lint-fix # runs the linter with autofix
```

### Folder Structure

- `/__mocks__` - mocks for testing
- `/__tests__` - this contains all our jest tests. The folder structure in here mirrors the folder structure inside `/src`
- `/.vscode` - contains vscode workspace settings + recommended plugins
- `/src`
  - `/client`
    - `/assets`
    - `/components`
    - `/routes`
  - `/common`
  - `/server`
    - `/api`
    - `/models` 
    - `/resolvers`
- `// lots of config files here`



### Tooling

We use:
- Jest for testing
- Circle CI
- Eslint (there's a different config for server and client)
- Prettier (can be used with `npm format` but we also use the eslint integration)
- Nodemon
- Webpack Dev Server
- TypeDoc - for documentation

### Bots
- Dependabot Preview - makes PRs for dependency upgrades
- Codecov - creates code coverage report for each PR, works with Circle CI

### Github Actions
In this repo, Github Actions are used for:
- delete merged PR branches
- automatically create draft PRs for pushed branches
