FROM node

# Working directory
WORKDIR /usr/src/app

# Build empty project with package- and package-lock.json to enable caching
COPY package*.json ./

RUN npm i

# Copy over app source
COPY . .

EXPOSE 8080
