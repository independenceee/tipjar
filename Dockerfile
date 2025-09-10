# Use official Node.js image as base
FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the Next.js app (if using Next.js)
RUN npm run build

# Expose port (default for Next.js)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
