#!/bin/bash
# Sets up Vaken developer environment. Please run in the top level of the Vaken repository.

ENVFILE=".env"
GLOBAL_DEPS=("webpack" "webpack-cli" "typescript" "ts-node")

# check if envfile exists
if [ ! -f $ENVFILE ]; then
    cp "$ENVFILE.template" "$ENVFILE"
    echo "Please update $ENVFILE with valid environment variables."
fi

npx check-node-version --node $(cat .nvmrc)

npm install # local dependencies
npm install -g "${GLOBAL_DEPS[@]}"
