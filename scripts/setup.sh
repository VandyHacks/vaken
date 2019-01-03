#!/usr/bin/env bash

### setup script for Vaken

# copy over config file if config doesn't exist already (suppresses errors)
cp -n config.template.json config.json || true

# run setup script
ts-node ../src/dbsetup.ts