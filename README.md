# Taskboard

“Taskboard is a work-in-progress application”

This repo contains a React client and an Express server

## Features

not current features

## Tech stack

- **Client:** React, TypeScript, Vite
- **Server:** Node.js, Express, TypeScript, Zod
- **Tooling:** ESLint, Prettier, Husky, lint-staged, commitlint

## Prerequisites

- NodeJS >=v24
- npm >=v11
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sammern-stack/taskboard.git
cd taskboard
```

### 2. Install dependencies

```bash
npm install
```

## Environment Variables

### Server

make sure you copy the content of `server/.env.example` to your `server/.env`

env variables must follow the format:

| Variables | Description                                         | Required |
| --------- | --------------------------------------------------- | -------- |
| PORT      | Server port; defaults to `4000` if empty or missing | No       |
| NODE_ENV  | `development`, `test` or `production`               | Yes      |

during development is suggested to use `NODE_ENV=development`

make sure you don't commit secrets from your `.env` file

### Client

no env variables as of right now

## Start the application

to start both the server and client you can use the following command

```bash
npm run dev
```

you can also run individually with

```bash
npm run dev:client
npm run dev:server
```

## Available scripts

| Command                   | Purpose                                     |
| ------------------------- | ------------------------------------------- |
| `npm run dev`             | Start client and server in development mode |
| `npm run lint`            | Check code with ESLint                      |
| `npm run lint:fix`        | Apply available ESLint fixes                |
| `npm run format`          | Format files with Prettier                  |
| `npm run format:check`    | Check formatting without changing files     |
| `npm run build -w client` | Build the client                            |
| `npm run build -w server` | Build the server                            |

## Contributing

1. Create a branch for your change.
2. Make and test your changes.
3. Stage your files and commit them using Conventional Commits,
   for example: `feat: add task creation`.
4. Open a pull request.
