# Base image
From node:20

# Set working directory
WORKDIR /src

# Copy package files
COPY package*.json ./

COPY prisma ./prisma

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Scheme generate
RUN npx prisma generate


# Expose port your Node.js app listen to
EXPOSE 5001

# Start the app
CMD ["node", "dist/server.js"]
