# Task Manager — API

Express + TypeScript backend (PostgreSQL). Minimal API for user auth and task CRUD.

## Requirements
- Node.js (>= 18)
- pnpm
- PostgreSQL database

## Environment
Create `apps/api/.env` with at minimum:

```text
PORT=2080
DATABASE_URL=postgres://<user>:<pass>@<host>:<port>/<db>
JWT_SECRET=your-secret
```

## Quick start
1. Install dependencies:

	```bash
	pnpm install
	```


2. The API will automatically apply migrations from `apps/api/migrations/` when it starts. Ensure the database is reachable and the `DATABASE_URL` is set.

3. Run dev server:

	```bash
	cd apps/api
	pnpm dev
	```

Default: http://localhost:2080

Notes: If you prefer running the whole monorepo, from project root use `pnpm dev` (uses turbo) to start both services.
