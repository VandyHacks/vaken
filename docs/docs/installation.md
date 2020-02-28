---
id: installation
title: Installation
sidebar_label: Installation
---

Here, we will get you started utilizing Vaken.

## Clone the repository

If you do not have git installed on your machine, you will need to do that first. Head to [https://git-scm.com/downloads] and download the appropriate installer for your operating system.

Then, clone the repository from GitHub by opening a command line prompt (Terminal on OSX, or Command Prompt on Windows), and navigating to the desired install location. Then, use this command:

`git clone https://github.com/VandyHacks/vaken.git`

Then, change directory into Vaken by using:

`cd vaken`

## Install dependencies

If you do not have Node or npm on your machine, [install it here](https://www.npmjs.com/get-npm).

From the vaken folder, type `npm i` to install all dependencies of the project.

## `.env` file

We use a `.env` file in order to handle all secrets that specific to your application. This includes your API keys for OAuth, your connection URI to MongoDB, and more. Copy the `.env.template`, and replace it with your own values.

:::tip
Don't forget the `.env` file! Otherwise, you will not be able to connect to a database.
:::

## Run the app!

Now that you have everything installed and ready to go, run `npm run dev` in your terminal from the root directory. This will concurrently build the client, generate GraphQL types, start the server, and start the client. All of these things will automatically rebuild as you change the application–open a tab at [localhost:8081](localhost:8081) and you're ready to see the app live!

If you would like to use the GraphQL playground to make queries through a UI on your database, you may do so at [localhost:8080](localhost:8080).
