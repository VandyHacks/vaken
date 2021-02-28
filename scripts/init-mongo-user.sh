#!/usr/bin/env bash
echo "Creating mongo users..."
mongo -u root -p rootpass --eval "db.getSiblingDB('vaken').createUser({user: 'vaken', pwd: 'vaken123', roles: [{role: 'dbOwner', db: 'vaken'}]});"
echo "Mongo users created."