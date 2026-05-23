# 🚀 NextStep — Job Application Tracker

**NextStep** is a web application that helps job seekers organize, track, and manage their entire recruitment process in one place. Built as part of OPCODE Club training.

🔗 **Live Demo:** [NasBad.github.io/OPCODE-Nextstep](https://NasBad.github.io/OPCODE-Nextstep)

---

## 📋 What does it do?

NextStep lets you track every job application through the full recruitment lifecycle:

1. **Wishlist** — Jobs you want to apply for
2. **Applied** — Applications you already sent
3. **Interviewing** — Active interview processes
4. **Offer** — Offers you received
5. **Rejected** — Applications that didn't work out

You can view your jobs as a **Kanban board** (columns) or a **List view**, search and filter, write private notes per job, and archive old applications.

---

## ✨ Features

- Kanban board and list view
- Add, edit, move, and archive job applications
- Status tracking with timestamps
- Private notes per job
- Search and filter
- Dark / Light mode
- User authentication (login / register)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Material UI |
| Data Fetching | React Query + Axios |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma |
| Auth | JWT + bcrypt |

---

## 👥 Team

| Name | GitHub | Role |
|------|--------|------|
| Mahmoud | [@mahmoudz2000](https://github.com/mahmoudz2000) | Backend lead, auth, React Query setup |
| Naseem | [@NasBad](https://github.com/NasBad) | Frontend lead, validation, login/register pages |
| Tarek | — | Jobs CRUD endpoints + frontend connection |

---

## 📁 Project Structure

```
OPCODE-Nextstep/
├── frontend/              # React app — the user interface
│   ├── src/
│   │   ├── api/           # axios client + API functions (jobs, auth)
│   │   ├── components/    # reusable UI components
│   │   ├── features/      # dashboard, kanban, list view
│   │   ├── pages/         # Dashboard, Archive, Login, Register
│   │   └── main.jsx       # app entry point (QueryClientProvider here)
│   └── package.json
└── backend/               # Express API — the server
    ├── src/
    │   ├── routes/        # auth, jobs, user, status
    │   ├── controllers/   # auth, jobs, user logic
    │   ├── middleware/     # JWT auth + validation
    │   └── index.js       # server entry point
    ├── prisma/
    │   └── schema.prisma  # database tables (User + Job)
    └── package.json
```

---

## 🖥️ Running Locally

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

**Backend**
```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev
```
Runs on `http://localhost:5000`

---

## ✅ What's Done

| Task | Who | Status |
|------|-----|--------|
| Kanban board UI | Naseem + Mahmoud | ✅ Done |
| List view | Naseem + Mahmoud | ✅ Done |
| Add / Edit / Delete / Restore jobs | Naseem + Mahmoud | ✅ Done |
| Archive page | Naseem + Mahmoud | ✅ Done |
| Dark / Light mode | Naseem + Mahmoud | ✅ Done |
| Search & filter | Naseem + Mahmoud | ✅ Done |
| Backend auth (register, login, logout) | Mahmoud | ✅ Done |
| JWT auth middleware | Mahmoud | ✅ Done |
| React Query setup + API layer | Mahmoud | ✅ Done |

---

## ⏳ What Still Needs to Be Done

### Naseem — `backend/middleware` + `frontend/auth-pages`
1. Create `backend/src/middleware/validate.middleware.js`
   - Validate: name not empty, email format, password min 6 chars
   - Return `400` with clear message if validation fails
2. Create Login page in `frontend/src/pages/LoginPage.jsx`
   - Use `useMutation` from React Query
   - Call `login()` from `src/api/auth.api.js`
   - Save token to `localStorage` on success
3. Create Register page in `frontend/src/pages/RegisterPage.jsx`
   - Use `useMutation` from React Query
   - Call `register()` from `src/api/auth.api.js`

### Tarek — `backend/jobs` + `frontend/connect-jobs`
1. Build all job endpoints in `backend/src/controllers/job.controller.js`
   - Use in-memory array (no database yet)
   - GET `/api/jobs`, POST `/api/jobs`, PUT `/api/jobs/:id`
   - PATCH `/api/jobs/:id/status`, DELETE `/api/jobs/:id`
   - PATCH `/api/jobs/:id/restore`
   - GET `/api/jobs/:id/notes`, PATCH `/api/jobs/:id/notes`
2. Wire routes in `backend/src/routes/job.routes.js`
3. After backend is done → connect frontend:
   - In `frontend/src/App.jsx` replace `useState(jobsMock)` with `useQuery(["jobs"], getJobs)`
   - Replace `addJob`, `deleteJob`, `moveTo`, `editJob` with `useMutation`
   - After each mutation call `queryClient.invalidateQueries(["jobs"])`

---

## 🌿 Branch Naming & Git Rules

- `frontend/feature-name` — frontend changes
- `backend/feature-name` — backend changes
- Never push directly to main
- Always open a PR and wait for Mahmoud to review before merging
- Test your endpoints with Postman before opening a PR
