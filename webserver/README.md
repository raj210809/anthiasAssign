# Express + TypeScript Web Server

This repository contains a Node.js backend built using Express and TypeScript. It integrates with Supabase for data storage and provides a set of API endpoints for interacting with blockchain-related data.

## Features

- Express.js backend
- TypeScript for type safety
- Supabase PostgreSQL integration
- Environment-based configuration
- API routes for fetching and managing blockchain-related data

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (>= 16.x)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```sh
   cd <project-folder>
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and configure the environment variables:
   ```env
   SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
   SUPABASE_KEY=YOUR_SUPABASE_KEY
   TOKEN_ADDRESS=YOUR_TOKEN_ADDRESS
   ALERT_SUPPLY_THRESHOLD=
   ALERT_HOLDER_PERCENTAGE=
   ```

4. Start the server:
   ```sh
   npm run dev
   ```

   For production:
   ```sh
   npm run build && npm start
   ```

## Project Structure

```
├── src
│   ├── index.ts        # Entry point of the server
│   ├── routes           # API routes
│   ├── controllers      # Request handlers
│   ├── utils            # Helper functions
│
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # Documentation
```

## Deployment

To deploy the server:

1. Build the project:
   ```sh
   npm run build
   ```

2. Run the production build:
   ```sh
   npm start
   ```

Alternatively, you can deploy it on cloud services like AWS, Vercel, or DigitalOcean.

## License

This project is licensed under the MIT License.

