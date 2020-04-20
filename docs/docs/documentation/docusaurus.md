---
id: docusaurus
title: Docusaurus and Deployment
sidebar_label: Docusaurus and Deployment
---

## Editing the Documentation

This documentation was built using [Docusaurus](https://docusaurus.io/). Complete documentation on how to use the documentation is there.

:::tip
Some examples of how to style docusaurus, use markdown, and use MDX are in the [Using Docusaurus folder!](./doc1.md)
:::tip

If you would like to edit the documentation or report an error, please open [an issue on GitHub](https://github.com/vandyhacks/vaken/issues) and submit a pull request! We would appreciate the fixing of any errors we may have made.

As for running the documentation, you may use `npm run docs:start` to start running the docs on [localhost:3000](http://localhost:3000/).

## Deploying the Documentation

Our documentation is hosted in multiple places. One of them is on [ZEIT Now](https://zeit.co/), and the other one is on [Netlify](https://www.netlify.com/).

### ZEIT Now

- From the directory that the documentation is hosted in, type `now --prod` to deploy the documentation to production. Currently, this deployment is hosted at [https://vaken-docs.now.sh/](https://vaken-docs.now.sh/).
- Alternatively, running `npm run docs:deploy` from the root directory of this repository will run the same thing.

### Netlify

- This documentation is also automatically deployed on Netlify to [https://vaken-docs.netlify.app/](https://vaken-docs.netlify.app/) and to [https://vaken-docs.vandyhacks.org/](https://vaken-docs.vandyhacks.org/).
- This is trigger on every `git push`.
