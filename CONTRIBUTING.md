# Contributing

Guide for contributors


### Setup

> TODO: put all this in an install.sh

```bash
npm i
npm i -g nodemon webpack webpack-cli typescript ts-node
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
