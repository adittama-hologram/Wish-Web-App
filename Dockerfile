# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Build the obfuscated frontend files
RUN npm run build

# Expose port 3010
EXPOSE 3010

# Start the application
CMD ["npm", "start"]
