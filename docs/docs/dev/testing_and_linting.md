---
id: testing_and_linting
title: Testing and Linting
sidebar_label: Testing and Linting
---

### Testing

We use Jest for testing. Snapshot testing is mostly for frontend, while mocking is preferable for backend.

Our local jest tests use the `--only-changed` option, which runs tests only for files that are actually changed, to speed up testing. NOTE: the CI will run all the tests regardless.

Jest configs are split using projects into specific backend and frontend configurations (see [./jest.config.js](./jest.config.js))

Running tests

```bash
npm run generate
npm run check:test # runs only changed tests
npm run check:test:ci # runs all tests
```

### Linting

We use Eslint for linting. The linting tests are cached with the `--cache` option.

NOTE: there are multiple eslint files. The rules are cascaded with the rule in the more specific directory taking priority (see [Eslint cascading hierarchy](https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy))

- client-specific config: [./src/client/.eslintrc.js](./src/client/.eslintrc.js)
- common (shared between server+client) config: [./.eslintrc.js](./.eslintrc.js)

```bash
npm run check:lint # runs the linter
npm run check:lint:fix # runs the linter with autofix
```

