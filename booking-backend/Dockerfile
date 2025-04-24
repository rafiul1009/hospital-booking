# Use an official node.js runtime as a parent image
FROM node:20.11.1

# Set the working directory in the container
WORKDIR /app

# Copy the package.json, package-lock.json files and prisma folder to the container
COPY package*.json ./
COPY prisma ./prisma/

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the app runs on
EXPOSE 9001

# Define the command to run your application
CMD ["npm", "run", "dev"]