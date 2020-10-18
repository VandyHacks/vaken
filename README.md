# Vaken

[![CircleCI](https://img.shields.io/circleci/build/github/VandyHacks/vaken.svg)](https://circleci.com/gh/VandyHacks/vaken)
[![codecov](https://codecov.io/gh/VandyHacks/vaken/branch/staging/graph/badge.svg)](https://codecov.io/gh/VandyHacks/vaken)
![GitHub](https://img.shields.io/github/license/vandyhacks/vaken.svg)
[![Depfu](https://badges.depfu.com/badges/cef18db6a35fb2d23a3a917ea9b6d852/overview.svg)](https://depfu.com/github/VandyHacks/vaken?project_id=7955)
[![Maintainability](https://api.codeclimate.com/v1/badges/945dac4210d3058caa78/maintainability)](https://codeclimate.com/github/VandyHacks/vaken/maintainability)
[![Netlify Status](https://api.netlify.com/api/v1/badges/cdc95135-f17b-44f4-8bbb-a4da3c5c831c/deploy-status)](https://app.netlify.com/sites/vaken-docs/deploys)

A next-gen hackathon registration system.

## Features

- Full hacker view and management system
- Create and edit sponsors
- Create and edit events, with Google Calendar integration
- Supports storing NFC IDs for hackers, compatible with most NFC scanners/wristbands/cards.
	- Supports tracking event attendance when scanning hackers into events
- Sends emails via AWS SES for hacker acceptances automatically
- Stores resumes in GCP
- [WIP] Dashboard with detailed statistics for organizers

### User Roles
- Organizer (Admin)
    - see hacker management view below
    - can scan NFC
- Volunteer
    - can scan people into events via NFC or manual search mode
- Mentor
- Hacker
	- can create and update application
    - see current application status
    - can RSVP after acceptance
- Sponsor
	- supports permissions based on tier and company


## Tooling

- TypeScript
- GraphQL via Apollo
- React
- React-Router
- Styled Components
- Immer
- Passport
- Express

# Screenshots

### Login Page
![Login Page](./pics/vaken1.png)

    - supports Github, Google, and Microsoft SSO logins

### Detailed Hacker Management for Organizers
![Organizer Page](./pics/vaken-org.png)

    - view individual hacker applications
    - fuzzy search + filter by various fields (first name, last name, email, school, grad year)
        - can have multiple search fields
    - filter by events attended
    - accept/reject hacker applications
    - export filtered hacker data to .csv

### Sponsors Management
![Sponsor page](./pics/vaken-sponsor.png)

    - create sponsorship tiers, and set permissions
    - create companies, associate with a tier
    - create sponsors, associate with a company

## Contributing

All contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for setup and development instructions.

## Customizing for your event
- constants: [./src/common/constants.json](./src/common/constants.json)
- application questions: [./src/client/assets/application.js](./src/client/assets/application.js)
- strings: [./src/client/assets/strings.json](.src/client/assets/strings.json)
- email templates: [./src/server/mail/templates](./src/server/mail/templates)

## Git Flow

This repository follows the [gitflow workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) designed around ensuring that features end up in the main branch and event deploy-specific customizations end up in event/* branches. When committing or submitting PRs to this repository, please make sure to read the gitflow link above (note 3. below for specific guidance regarding differences in our setup) and remember these key guidelines:

1. Use `git rebase <branch>` rather than pull or merge, always. This will make sure that there is a linear history which is essential when updating the core featureset of vaken while there is an event/* deployment. When exclusively using rebase instead of pull, updating the event/production branch with new features from main is as simple as running `git checkout event/<name> && git rebase main`.
2. Always PR feature updates to `main`. The main branch should have all new features, bug fixes, and dep updates. These commits should only make their way to `event/` branches by the process mentioned in tip 1. The reason for this is that we want to make our changes available to everyone using this repository as a base for their hackathon's systems, and having important features in an event/ branch requires them to sift through countless customizations for VandyHacks's own needs. rather than being able to deploy their own event from the main branch.
3. Our model of gitflow centers around the `main` branch being the cannonical version of "vaken". `event/` branches should be deployed to production (VandyHacks uses a Hobbyist dyno from Heroku) and should contain all of the customizations to branding and application info for a specific event. Why? It's simple: we have different needs for virtual events and physical events, and rather than duplicate all of the effort to customize vaken for different events, being able to create a draft PR and see every single change required for a "completed" deploy from main makes the process of deploying a future event trivial in comparison to doing it the first time. Let's stop trying to reinvent the wheel!
4. Event/production branches should never be merged back to `main`. If it's something that you might want to use for a future event (or something another hackathon could use), put it in `main`.

## Questions?

Feel free to reach out to us at `info[at]vandyhacks.org` or `dev[at]vandyhacks.org`!

## Thanks

- To [Netlify](https://netlify.com) for providing us with a free pro plan for this open source project.
