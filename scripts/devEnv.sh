#!/bin/bash
# Sets up Vaken developer environment. Please run in the top level of the Vaken repository.

ENVFILE=".env"

# check if envfile exists
if [ ! -f $ENVFILE ]; then
    cp "$ENVFILE.template" "$ENVFILE"
    echo "Please update $ENVFILE with valid environment variables."
fi

sh ./scripts/verifyNode.sh
npm install # local dependencies

echo 'Run export PATH="$PATH:./node_modules/.bin" if you want node packages on your PATH.'