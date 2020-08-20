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

    - supports GitHub, Google, and Microsoft SSO logins

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
- strings: [..src/client/assets/strings.json](.src/client/assets/strings.json)
- email templates: [./src/server/mail/templates](./src/server/mail/templates)

## Questions?

Feel free to reach out to us at `info[at]vandyhacks.org` or `dev[at]vandyhacks.org`!

## Thanks

- To [Netlify](https://netlify.com) for providing us with a free pro plan for this open source project.
