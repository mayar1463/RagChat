# Stage 1: install dependencies and build
FROM node:18-alpine AS base

# Install MySQL client
RUN apk add --no-cache mysql-client

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Stage 2: app runtime image (production)
FROM node:18-alpine AS runtime

# Set the working directory
WORKDIR /app

# Copy the built application from the 'base' stage
COPY --from=base --chown=node:node /app /app

# Create the logs directory and ensure the 'node' user can write to it
# The 'node' user is the default for this image, which is a good security practice.
RUN mkdir -p /app/src/logs && chown -R node:node /app/src/logs

# Expose the application port
EXPOSE 5001

# Command to run the application
CMD ["node", "src/server.js"]

# Stage 3: test image
FROM base AS test

WORKDIR /app
CMD ["npm", "test"]
