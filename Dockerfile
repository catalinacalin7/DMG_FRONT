# FROM node:20-alpine

# RUN mkdir -p /usr/src
# WORKDIR /usr/src

# COPY . /usr/src

# ENV NODE_OPTIONS=--openssl-legacy-provider

# RUN npm install

# RUN npm run build

# EXPOSE 3000

# CMD npm run start

FROM node:22-alpine

# Enable corepack to use pnpm
RUN corepack enable

# Create and set the working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# Copy the project files
COPY . /usr/src

# Set Node.js options to handle compatibility issues
ENV NODE_OPTIONS=--openssl-legacy-provider

# Install dependencies using pnpm
RUN pnpm install

# Build the project
RUN pnpm run build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["pnpm", "run", "start"]

