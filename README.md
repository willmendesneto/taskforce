# TaskForce - Next App

This is a modern web application built with Next.js, TypeScript, and other cutting-edge technologies. It is designed for scalability, performance, and developer productivity.

## Features

- 🚀 **Next.js** - React framework for production
- 🔒 **TypeScript** - Type safety for robust code
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧪 **Testing** - Comprehensive testing setup with Vitest and Cypress
- 📦 **Docker/Docker Compose** - Containerized development and deployment
- 🔍 **ESLint** - Code linting with strong rules
- 💅 **Prettier** - Code formatting
- ✅ **Zod** - Schema validation

## Getting Started

### Prerequisites

- Node.js (version 20.10.0 or higher)
- npm

### Installation

Ensure you are using the Node.js version specified in the `.nvmrc` file. Use a version manager like `nvm` to manage your Node.js versions.

```bash
# If using nvm
nvm install $(cat .nvmrc)  # Install required Node.js version
nvm use $(cat .nvmrc)      # Use Node.js version
```

Install dependencies:

```bash
# not: The `--legacy-peer-deps` flag is already added via `.npmrc` file
npm install --legacy-peer-deps
# OR
npm ci --legacy-peer-deps
```

### Development

If you're running this project without using Docker and Docker Compose, please make sure you applied the correct changes in your `.env` file. Specifically for `DATABASE_URL` string, which should point to your PostgreSQL instance... or you can just run `docker-compose up --build` and enjoy the app running with no issues so far!

> Create a `.env` file if it doesn't exist. You can copy `.env.example` as a starting point:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000/`.

### Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run start
```

## Testing

### Unit Tests

Run unit tests with Vitest:

```bash
npm run test:unit
```

Run tests in watch mode:

```bash
npm run test:watch
```

### E2E Tests

Open Cypress test runner:

```bash
npm run cypress:open
```

Run all E2E tests:

> When running this command, please make sure you're also running the app via `docker-compose up --build`. Otherwise, some tests trying to access the app with test users will be failing - this is expected since

```bash
npm run test:e2e
```

## Code Quality

### Type Checking

Run TypeScript type checks:

```bash
npm run type:check
```

### Linting

Run ESLint:

```bash
npm run lint
```

### Formatting

Format code with Prettier:

```bash
npm run format
```

Check code formatting:

```bash
npm run format:check
```

### Bundle Size Analysis

Check bundle size:

```bash
npm run bundlesize
```

## Project Structure

```
app/
├── api/                    # API routes
├── dashboard/              # Dashboard pages
├── login/                  # Login pages
├── register/               # Registration pages
components/
├── auth/                   # Authentication components
├── dashboard/              # Dashboard components
├── projects/               # Project-related components
├── tasks/                  # Task-related components
├── ui/                     # Reusable UI components
cypress/                    # Cypress E2E tests
hooks/                      # Custom React hooks
lib/                        # Utilities and shared code
public/                     # Static assets
styles/                     # Global styles
tests/                      # Unit tests
types/                      # TypeScript type definitions
```

## Docker

### Development

Run the application in a Docker container:

```bash
docker-compose up --build
```

#### Troubleshooting

⚠️ There's an **intermittent issue** when running `docker-compose up --build` and Web app not being able to fix `next`. This is because Docker is overriding `node_modules`. If you face this issue, please run `npm ci` in your local environment **before running** `docker-compose up --build` command and the issue should be solved. ⚠️

### Database

The application uses a database container defined in `docker-compose.yml`. Nothing else than running a `docker-compose up --build` should be done since Docker Compose is already doing the app setup.

There's an user with credentials `admin@admin.com/password123`. Please DO NOT access the app using Admin User since it's used ONLY for testing purposes. More details on Cypress E2E tests.

## Improvements

- [ ] Add dark mode support via switch
- [ ] Add i18n support in app and tests

## Author

**Wilson Mendes (willmendesneto)**

- <http://github.com/willmendesneto>
