FROM node:18-alpine AS development
USER node
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
COPY prisma ./prisma
COPY doc ./doc
RUN npm ci && npx prisma generate
COPY --chown=node:node . .
CMD ["npm", "run", "start:dev"]

FROM node:18-alpine AS build
USER node
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .
RUN npm run build
ENV NODE_ENV production
RUN npm ci --omit=dev && npm cache clean --force

FROM node:18-alpine AS production
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY doc ./doc
CMD ["node", "dist/main.js"]