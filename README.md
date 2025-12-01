# Task Manager Dashboard

Lightweight task manager web app (React frontend + Express/TypeScript API) with JWT auth and PostgreSQL.

<p align="center">
	<img src="docs/hero.png" alt="Task Manager Dashboard UI" width="720" />
</p>

## Highlights
- **Authentication**: User registration & login with bcrypt-hashed passwords, JWT issuance, and auth middleware guarding every task endpoint.
- **Task experience**: CRUD, priority, due date, overdue highlighting, sorting (due date/priority/created), and server-side pagination with total counts.
- **Robust API**: Express controllers, Zod validation on body/query params, PostgreSQL migrations, and typed pg models.
- **State & UI**: React + Redux Toolkit drive auth & task data, with responsive styling and reusable modal components.
- **Deployment ready**: Dockerized API on AWS ECS Fargate, React build on S3 + CloudFront (Origin Access Control), automated via GitHub Actions.

## Tech Stack
- **Frontend**: React 19, TypeScript, Redux Toolkit, Vite, Tailwind utilities.
- **Backend**: Node.js 20, Express 5, PostgreSQL (pg), Zod, bcrypt, jsonwebtoken.
- **Tooling**: pnpm workspaces, Turbo, ESLint/Prettier, Docker multi-stage builds.
- **Infrastructure**: Amazon ECS + ECR, S3, CloudFront, GitHub Actions CI/CD.

## Architecture Overview
- Monorepo managed by pnpm workspaces (`apps/api`, `apps/app`).
- API exposes `/api/register`, `/api/login`, `/api/tasks` (CRUD) with JWT auth and Postgres persistence.
- React SPA consumes the API via Axios client configured with `VITE_API_URL`, global state via Redux slices, and protected routes.
- CI pipeline builds/tests both apps, pushes API images to ECR, updates ECS service, and publishes the SPA to S3/CloudFront.

## API Surface

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/register` | Create account, respond with user + JWT |
| POST | `/api/login` | Authenticate existing user, set cookie + return JWT |
| GET | `/api/tasks` | List paginated tasks (supports `page`, `limit`, `sortBy`, `order`, `priority`) |
| POST | `/api/tasks` | Create task (title, description, priority, end date) |
| PUT | `/api/tasks/:id` | Update task fields |
| DELETE | `/api/tasks/:id` | Remove task |

All `/api/tasks` routes require a valid JWT (middleware accepts HttpOnly cookie or `Authorization: Bearer` header).

## Environment Configuration

### Backend (`apps/api/.env`)
| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign tokens |
| `APP_ORIGIN` | Comma-separated list of allowed frontend origins (e.g., `http://localhost:2081, https://d2osdmwl6r3mj2.cloudfront.net`) |
| `PORT`, `HOST` | Optional server overrides (default `2080`, `0.0.0.0`) |
| `COOKIE_SECURE` | Set to `true` in production to send secure cookies |

### Frontend (`apps/app/.env`)
| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Base URL of the deployed API (e.g., `https://api.example.com`) |

### Token storage rationale
- API sets a **HttpOnly `token` cookie** after login/register to mitigate XSS risks while preserving seamless browser requests.
- The React app mirrors the token in `localStorage` strictly to attach an `Authorization` header (for cross-origin fetches and API tooling). The backend accepts either cookie or header, and tokens expire in 7 days.

## Setup & Local Development
1. Install dependencies from repo root:

	```bash
	pnpm install
	```

2. Configure environment files:
	- Backend: `cp apps/api/.env.example apps/api/.env` and update values.
	- Frontend: create `apps/app/.env` with `VITE_API_URL=http://localhost:2080` for local dev.

3. Start PostgreSQL (Docker or local). The API auto-runs migrations on boot via `postgres-migrations`.

4. Launch both apps:

	```bash
	pnpm dev
	```

	Or run individually:
	- Backend: `cd apps/api && pnpm dev` (http://localhost:2080)
	- Frontend: `cd apps/app && pnpm dev -- --port 2081`

### Useful commands
- `pnpm dev` – run all dev servers via Turbo
- `pnpm lint` – lint workspaces
- `pnpm --filter api... run build` / `pnpm --filter app... run build` – production builds

## Deployment & Operations
- GitHub Actions workflow (`.github/workflows/deploy.yml`) runs on pushes to `main`:
  1. Builds API, publishes Docker image to Amazon ECR, registers a new ECS task definition revision, and forces service rollout.
  2. Builds React app, syncs `apps/app/dist` to the S3 bucket, and invalidates CloudFront.
- AWS footprint:
  - API: ECS Fargate service (`default-task-manager-26c5`) behind an ALB.
  - Frontend: S3 bucket (`dipendra-task-manager-demo`) served privately via CloudFront distribution (`d2osdmwl6r3mj2`) with Origin Access Control + custom error responses for SPA routing.
