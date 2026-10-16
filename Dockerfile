FROM node:22-alpine3.24 AS build

WORKDIR /app

ARG API_URL
ARG NEXT_PUBLIC_URL
ARG NEXT_SERVER_ACTIONS_ENCRYPTION_KEY

ENV API_URL=$API_URL \
	NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL \
	NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=$NEXT_SERVER_ACTIONS_ENCRYPTION_KEY \
	NEXT_TELEMETRY_DISABLED=1

# Pinned to match package.json "packageManager"
RUN npm install -g pnpm@10.18.3

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . ./

RUN pnpm build

FROM node:22-alpine3.24 AS production

WORKDIR /app

ENV NODE_ENV=production \
	NEXT_TELEMETRY_DISABLED=1

# Copy standalone server + bundled deps
COPY --from=build /app/.next/standalone ./

# Static assets (standalone doesn't inline these)
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Create cache dir
RUN mkdir -p .next/cache/images

ENTRYPOINT ["node", "server.js"]