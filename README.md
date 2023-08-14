# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/YuMentsel/nodejs2023Q2-service.git
```

```
cd nodejs2023Q2-service
```

```
git checkout part-2/docker-db-orm
```

## Installing NPM modules

```
npm install
```

## Create .env file

```
cp .env.example .env
```

## Start Docker containers

```
npm run docker
```
or

```
docker compose up
```

Wait... ☕

In case of problems, either restart `npm run docker` or clean data in the Docker Desktop.

Run Prisma ORM migrations
```
 npm run migrate:dev
```

Run tests

```
npm run test
```

Run scan security vulnerabilities

```
npm run docker:scan
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
