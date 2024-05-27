# Company Info Integration Back-End

## Overview

This project is the back-end service for integrating company information. It provides various functionalities to manage and retrieve company data through a RESTful API. This README will guide you through the necessary steps to get the application up and running.

## Project Information

- **Name:** company-info-integration-back-end
- **Version:** 1.0.0
- **Author:** Maurice ten Teije
- **License:** ISC

## Table of Contents

- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Dev Dependencies](#dev-dependencies)

## Getting Started

To get the application up and running, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/company-info-integration-back-end.git
   cd company-info-integration-back-end
   ```

2. **Install dependencies:**

```sh
npm install
```

3. **Set up environment variables (for development):**

Create a .env file in the root directory and add necessary environment variables. Example:

```sh
HUBSPOT_APP_ID = xyz
HUBSPOT_APP_DEVELOPER_KEY = xyz
HUBSPOT_WEBHOOK_TARGET_URL = xyz
HUBSPOT_CLIENT_ID = xyz
HUBSPOT_CLIENT_SECRET = xyz
HUBSPOT_REDIRECT_URL = xyz
HUBSPOT_SCOPE = xyz
HUBSPOT_GROUP_NAME = xyz
HUBSPOT_COMPANY_OBJECT_TYPE = xyz
FRONT_END_BASE_URL = xyz
SPARKPOST_API_KEY = xyz
DATABASE_URL= xyz
NGROK_FORWARDING_URL= xyz
```

4. **Run database migrations:**

```sh
npm run prisma:migrate
```

5. **Start the application:**

```sh
npm run start:dev
```

## **Scripts**
The following scripts are available in the project:

- `start`: Starts the application.
- `start:dev`: Starts the application with nodemon for development.
- `start:tunnel`: Starts the application with ngrok for tunneling.
- `test`: Runs the Jest test suite.
- `test:watch`: Runs the Jest test suite in watch mode.
- `test:coverage`: Generates a code coverage report using Jest.
- `lint:check`: Checks for linting errors using ESLint.
- `lint:fix`: Fixes linting errors using ESLint.

## **Dependencies**
The project relies on the following dependencies:

- `express`: Web framework for Node.js.
- `axios`: Promise-based HTTP client.
- `bcrypt`: Library to hash passwords.
- `cors`: Middleware to enable CORS.
- `dotenv`: Loads environment variables from a .env file.
- `jsonwebtoken`: JSON Web Token implementation.
- `nodemailer`: Module to send emails.
- `pg`: PostgreSQL client for Node.js.
- `uuidv4`: Library to generate UUIDs.

## **Dev Dependencies**
The project includes the following dev dependencies:

- `@prisma/client`: Prisma Client for database access.
- `@types/*`: TypeScript type definitions.
- `eslint`: Linter for JavaScript and TypeScript.
- `jest`: JavaScript testing framework.
- `nodemon`: Tool to automatically restart the application on file changes.
- `prisma`: Next-generation ORM.
- `ts-jest`: Jest transformer for TypeScript.
- `typescript`: TypeScript language.

