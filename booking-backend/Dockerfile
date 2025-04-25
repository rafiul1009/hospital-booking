# Use an official node.js runtime as a parent image
FROM node:20.11.1

# Set the working directory in the container
WORKDIR /app

# Copy the package.json, package-lock.json files and prisma folder to the container
COPY package*.json ./
COPY prisma ./prisma/

# Install build dependencies for bcrypt
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install the dependencies and rebuild bcrypt
RUN npm install
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port that the app runs on
EXPOSE 9001

# Define the command to run your application
CMD ["npm", "run", "start"]