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

Running tests and dev server:
```bash
npm run dev-server // runs dev server
npm t // runs tests
```

### Folder Structure


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
- `/tests` - this contains all our tests
- `// lots of config files here`



### Tooling

We use:
- Jest for testing
- Circle CI
- Eslint
- Prettier
