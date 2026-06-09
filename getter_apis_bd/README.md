# CityPulse database

This repository owns the PostgreSQL schema, migrations, and initial city data
used by the CityPulse backend.

## Requirements

- A Neon PostgreSQL database
- Node.js and pnpm

## Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to the Neon pooled connection string.
3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Apply the committed migrations:

   ```bash
   pnpm run db:migrate
   ```

5. Insert the initial city catalog:

   ```bash
   pnpm run db:seed
   ```

Use the same `DATABASE_URL` value in the backend `.env`.

## Commands

- `pnpm run db:generate`: generate a migration after changing the schema.
- `pnpm run db:migrate`: apply committed migrations to the configured database.
- `pnpm run db:push`: synchronize the schema directly during development.
- `pnpm run db:seed`: insert the initial cities.
- `pnpm run db:studio`: open Drizzle Studio.

The database repository does not need external API keys. `OPENWEATHER_API_KEY`
and `NEWS_API_KEY` belong only in the backend configuration.
