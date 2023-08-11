FROM node:18-alpine AS development
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci
COPY --chown=node:node . .
CMD ["npm", "run", "start:dev"]

FROM node:18-alpine AS build
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
COPY --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .
RUN npm run build
ENV NODE_ENV production
RUN npm ci --omit=dev && npm cache clean --force

FROM node:18-alpine AS production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY doc ./doc
CMD ["node", "dist/main.js"]