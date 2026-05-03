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

You can view your jobs as a **Kanban board** (columns) or a **List view**, search and filter, write private notes per job, archive old applications, and export everything to Excel.

---

## ✨ Features

- Kanban board and list view
- Add, edit, move, and archive job applications
- Status tracking with timestamps
- Private notes per job
- Search and filter
- Dark / Light mode
- Excel export
- User authentication (login / register)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Material UI |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + bcrypt |

---

## 👥 Team

| Name | GitHub | Role |
|------|--------|------|
| Mahmoud | [@mahmoudz2000](https://github.com/mahmoudz2000) | Backend lead, auth, database |
| Naseem | [@NasBad](https://github.com/NasBad) | Frontend lead, middleware, validation |
| Tarek | — | Jobs CRUD, export |

---

## 📁 Project Structure

```
OPCODE-Nextstep/
├── frontend/    # React app — the user interface
└── backend/     # Express API — the server and database
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
npx prisma generate
npm run dev
```
Runs on `http://localhost:5000`

---

## 🌿 Branch Naming

- `frontend/feature-name` — frontend changes
- `backend/feature-name` — backend changes

Never push directly to main. Always open a PR and wait for review.
