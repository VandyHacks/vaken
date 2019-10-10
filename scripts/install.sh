#!/bin/bash
# Sets up Vaken developer environment. Please run in the top level of the Vaken repository.

ENVFILE=".env"
GLOBAL_DEPS=("nodemon" "webpack" "webpack-cli" "typescript" "ts-node")

cp "$ENVFILE.template" "$ENVFILE"
echo "Please update $ENVFILE with valid environment variables."

npm install # local dependencies
npm install -g "${GLOBAL_DEPS[@]}"
