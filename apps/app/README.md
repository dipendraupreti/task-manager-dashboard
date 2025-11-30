# Task Manager — Frontend

Small React + Tailwind frontend for the Task Manager app.

## Requirements
- Node.js (>= 20)
- pnpm

## Quick start
1. From project root install deps:

	```bash
	pnpm install
	```

2. Run frontend only:

	```bash
	cd apps/app
	pnpm dev -- --port 2081
	```

3. Open: http://localhost:2081

Notes:
- JWT is stored in localStorage by the client and is attached to requests using the Authorization header.
- The API also sets an HttpOnly `token` cookie on successful login/register; cookies are sent automatically when using requests with credentials enabled.
	Ensure the API (http://localhost:2080 by default) is running and its environment is configured correctly.
