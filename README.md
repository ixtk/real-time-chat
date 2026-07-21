# Chat App

MERN stack starter with a Vite React frontend and an Express/Mongoose backend.

## Structure

- `frontend` - React, React Router, React Hook Form, auth UI, and the next-exercise screen.
- `backend` - Node, Express, Mongoose, CORS, dotenv, nodemon, username/password auth.

## Setup

Install dependencies separately:

```bash
cd frontend
npm install
```

```bash
cd backend
npm install
```

Copy env examples if needed:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

## Run

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
cd backend
npm run dev
```

Frontend opens on `http://localhost:5173`. Backend runs on `http://localhost:5000`.

## Current Features

- Sign in and register modal use `react-hook-form` and call the backend with `axios`.
- Registration and login use `username` and `password`; email is not required.
- Login state is kept for 14 days with a JWT stored in an `httpOnly` cookie.
- After login, the app shows a placeholder for the next exercise: loading registered users.
- Backend currently includes MongoDB connection config, the `User` model, `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`, and `/api/health`.

## Next Exercise

Add a `GET /api/users` backend route and show all registered users except the logged-in user in the sidebar.
