# Chat App

MERN stack starter with a Vite React frontend and an Express/Mongoose backend.

## Structure

- `frontend` - React, React Router, React Hook Form, mock chat UI.
- `backend` - Node, Express, Mongoose, CORS, dotenv, nodemon.

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

- Sign in and register modal are frontend-only and use `react-hook-form`.
- Chat list, active conversation, messages, typing indicator, and sending messages use local mock data.
- Backend includes basic app structure, MongoDB connection config, `Chat` model, and `/api/health` plus `/api/chats` routes.
