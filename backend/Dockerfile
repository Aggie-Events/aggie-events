# Use an official Node.js runtime as a parent image
FROM node:20 AS base

FROM base AS deps

# Set the working directory
WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

# Use a smaller image for the production build
FROM base AS builder

# Set the working directory
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY ./ ./

RUN if [ -z "$NEXT_PUBLIC_API_URL" ]; then echo 'Environment variable NEXT_PUBLIC_API_URL must be specified. Exiting.'; exit 1; fi

# Build the Next.js application
RUN npm run build

# Production image, copy all the files and run node
FROM base AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./

ENV HOSTNAME="0.0.0.0"
CMD ["node", "index.js"]