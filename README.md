# NextStep — Job Application Tracker

A web app that helps job seekers track and manage all their applications in one place. Built as part of OPCODE Club training.

---

## Project Structure

```
OPCODE-Nextstep/
├── frontend/    # React + Vite + MUI — the user interface
└── backend/     # Node.js + Express + PostgreSQL — the server
```

---

## Team

| Name | GitHub | Role |
|------|--------|------|
| Mahmoud | [@mahmoudz2000](https://github.com/mahmoudz2000) | Backend lead, auth, database |
| Naseem | [@NasBad](https://github.com/NasBad) | Frontend lead, middleware, validation |
| Tarek | — | Jobs CRUD, export |

---

## Frontend

React app built with Vite and Material UI. Tracks job applications on a Kanban board and list view.

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

---

## Backend

Node.js + Express REST API. Handles authentication, jobs management, and user data with PostgreSQL via Prisma.

```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npx prisma generate
npm run dev
```

Runs on `http://localhost:5000`

---

## Branch Naming

- `frontend/feature-name` — frontend changes
- `backend/feature-name` — backend changes

Never push directly to main. Always open a PR and wait for review.
