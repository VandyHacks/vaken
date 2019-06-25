FROM node

# Build empty project with package- and package-lock.json to enable caching
WORKDIR /tmp
COPY package*.json /tmp/
RUN npm config set registry http://registry.npmjs.org/ && npm install

WORKDIR /usr/src/app

# Copy over app source
COPY . .

# Re-copy clean node_modules to app dir
RUN cp -a /tmp/node_modules /usr/src/app/
