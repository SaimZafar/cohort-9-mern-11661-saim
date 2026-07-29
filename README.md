<div align="center">

<img src="frontend/public/logo.svg" alt="Scribe logo" width="120" />

# Scribe

*A clean, private notes app built with React, Express, and MySQL*

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/tests-27%20passing-brightgreen)](#testing)
[![SonarQube](https://img.shields.io/badge/SonarQube-Quality%20Gate%20Passed-4E9BCD?logo=sonarqube&logoColor=white)](#code-quality)
[![License](https://img.shields.io/badge/license-MIT-blue)](#license)

Built for the **10Pearls Shine Internship Program** - Cohort 9, MERN track

</div>

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Testing](#testing)
- [Code quality](#code-quality)
- [Screens](#screens)
- [Author](#author)
- [License](#license)

---

## Overview

Scribe is a full-stack notes application where every user gets a private, authenticated space to create, edit, and organize rich-text notes. It was built as a complete demonstration of a production-style web application workflow: RESTful APIs, JWT-based auth, structured logging, centralized error handling, automated testing, and static code analysis - all wired together end to end.

> **Note on the stack:** the project follows the assignment's "MERN track" branding, but uses **MySQL** instead of MongoDB (per the assignment's own tech requirements, which explicitly call for a SQL database). So the actual stack is **React, Express, Node.js, and MySQL**.

## Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Sign up, log in, log out. Passwords hashed with bcrypt; sessions handled via signed JWTs with 7-day expiry. |
| 📝 **Rich text notes** | Create, edit, and delete notes with bold, italic, underline, and list formatting. |
| 🔒 **Per-user privacy** | Every note is scoped to its owner at the database query level - not just hidden in the UI. |
| 🔍 **Search & filter** | Instantly filter notes by title or visible content from the dashboard. |
| 📋 **Structured logging** | Every HTTP request/response and key event (signup, login, note CRUD) logged via Pino, with sensitive headers redacted. |
| ⚠️ **Global error handling** | One centralized middleware catches and formats every error consistently, with proper HTTP status codes. |
| 👤 **Profile page** | View account details and log out. |
| ✅ **Fully tested** | 9 backend tests (Mocha/Chai) + 18 frontend tests (Jest) - 27 total, all passing. |
| 🧹 **Static analysis** | Both backend and frontend pass a clean SonarQube Quality Gate. |

## Tech stack

<table>
<tr>
<td valign="top" width="50%">

**Backend**
- Node.js + Express - REST API
- MySQL (`mysql2`) - relational data store
- JWT (`jsonwebtoken`) + `bcrypt` - authentication
- Pino + `pino-http` - structured logging
- Mocha + Chai + Chai-HTTP - testing
- SonarQube - static analysis

</td>
<td valign="top" width="50%">

**Frontend**
- React 18 + Vite - UI + build tooling
- React Router 6 - client-side routing
- Context API - global auth state
- Custom `contentEditable` rich text editor
- Jest + React Testing Library - testing
- SonarQube - static analysis

</td>
</tr>
</table>

## Architecture

```text
┌─────────────┐        HTTPS/JSON        ┌──────────────┐        SQL        ┌───────────┐
│   React     │  ───────────────────▶    │   Express    │  ───────────────▶ │   MySQL   │
│  (Vite)     │  ◀───────────────────    │   REST API   │  ◀─────────────── │           │
│ :5173       │      JWT in header       │  :5000       │                   │  :3306    │
└─────────────┘                          └──────────────┘                   └───────────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │ Pino Logger  │
                                          │ (stdout /    │
                                          │  log files)  │
                                          └──────────────┘
```

**Request flow example - creating a note:**

```text
Frontend (NoteEditorPage)
   → api.js attaches JWT to Authorization header
   → POST /api/notes
   → authMiddleware verifies JWT → attaches req.user
   → noteController.create validates input
   → noteModel.createNote runs parameterized SQL INSERT
   → Pino logs the event + request/response
   → JSON response flows back to the frontend
```

## Project structure

```text
cohort-9-mern-11661-saim/
├── backend/
│   ├── config/
│   │   └── db.js                  # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js       # Signup/login logic
│   │   └── noteController.js       # Notes CRUD logic
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   └── errorHandler.js         # Global exception handling
│   ├── models/
│   │   ├── userModel.js            # Users table queries
│   │   └── noteModel.js            # Notes table queries
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── noteRoutes.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   └── notes.test.js
│   ├── utils/
│   │   └── logger.js               # Pino logger config
│   ├── schema.sql                  # Database schema
│   ├── .env.example
│   └── index.js                    # App entry point
│
└── frontend/
    ├── public/
    │   ├── logo.svg
    │   └── logo-mark.svg
    └── src/
        ├── api/
        │   └── api.js               # Centralized backend calls
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── NoteCard.jsx
        │   ├── RichTextEditor.jsx
        │   └── ProtectedRoute.jsx
        ├── context/
        │   └── AuthContext.jsx      # Global auth state
        ├── pages/
        │   ├── Landing.jsx
        │   ├── LoginPage.jsx
        │   ├── SignupPage.jsx
        │   ├── Dashboard.jsx
        │   ├── NoteEditorPage.jsx
        │   └── ProfilePage.jsx
        ├── tests/
        │   ├── AuthContext.test.jsx
        │   ├── Dashboard.test.jsx
        │   ├── LoginPage.test.jsx
        │   └── NoteCard.test.jsx
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

## Getting started

### Prerequisites

- Node.js v18 or higher
- MySQL Server (running locally)
- npm

### 1. Clone and install

```bash
git clone https://github.com/SaimZafar/cohort-9-mern-11661-saim.git
cd cohort-9-mern-11661-saim
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in your real values, see below
```

Create the database and tables:

```bash
mysql -u root -p < schema.sql
```

Start the backend:

```bash
npm start
```

➡️ Runs on **http://localhost:5000**

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env   # optional locally - defaults to http://localhost:5000/api
npm run dev
```

➡️ Runs on **http://localhost:5173**

Both servers need to be running simultaneously for the app to work.

## Environment variables

### Backend - `backend/.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the backend runs on | `5000` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username (required, no default) | `root` |
| `DB_PASSWORD` | MySQL password (required, no default) | `your_password` |
| `DB_NAME` | Database name (required, no default) | `notes_app` |
| `JWT_SECRET` | Secret used to sign JWTs - required, long random string | `sk_notes_app_secret_xyz` |
| `LOG_LEVEL` | Pino log level | `info` |
| `CORS_ORIGIN` | Allowed frontend origin for CORS. Defaults to `*` (wildcard) if unset - **for any non-local deployment, set this explicitly** to your actual frontend URL (e.g. `https://scribe.example.com`) instead of relying on the wildcard fallback. | `http://localhost:5173` |

> `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `JWT_SECRET` have no insecure defaults - the app fails fast at startup if any are missing, rather than silently falling back to privileged/blank credentials.

### Frontend - `frontend/.env`

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL the frontend uses to reach the backend API | `http://localhost:5000/api` |

## API reference

### Auth

| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Create a new account | No |
| `POST` | `/api/auth/login` | Log in and receive a JWT | No |

### Notes

| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| `GET` | `/api/notes` | Get all notes for the logged-in user | Yes |
| `GET` | `/api/notes/:id` | Get a single note by ID | Yes |
| `POST` | `/api/notes` | Create a new note | Yes |
| `PUT` | `/api/notes/:id` | Update an existing note | Yes |
| `DELETE` | `/api/notes/:id` | Delete a note | Yes |

Protected routes require an `Authorization: Bearer <token>` header.

## Testing

**Backend - Mocha/Chai (9 tests):**

```bash
cd backend
npm test
```

Covers: signup/login validation, JWT-protected routes, and full notes CRUD lifecycle.

**Frontend - Jest + React Testing Library (18 tests):**

```bash
cd frontend
npm test
```

Covers: `AuthContext` session handling, `LoginPage` form behavior, `NoteCard` rendering, and `Dashboard` fetching/search/empty states.

## Code quality

Both `backend` and `frontend` are analyzed with SonarQube (Community Edition, run locally via Docker).

| Project | Quality Gate | Security | Reliability | Maintainability | Duplications |
|---|---|---|---|---|---|
| `notes-app-backend` | ✅ Passed | A | A | A | 0.0% |
| `notes-app-frontend` | ✅ Passed | A | A | A | 0.0% |

## Screens

| Screen | Route | Description |
|---|---|---|
| Landing | `/` | Public marketing page |
| Sign up | `/signup` | Create an account |
| Log in | `/login` | Authenticate |
| Dashboard | `/dashboard` | List of notes with search |
| Note editor | `/notes/new`, `/notes/:id` | Create or edit a note |
| Profile | `/profile` | View account info, log out |

## Author

**Saim Zafar**
BSIT student, Bahria University Islamabad
[GitHub](https://github.com/SaimZafar)

## License

This project was built as part of the **10Pearls Shine Internship Program** (Cohort 9) for educational and assessment purposes. No formal open-source license is applied; all rights reserved by the author unless otherwise agreed with 10Pearls.

---

<div align="center">
Built as part of the 10Pearls Shine Internship Program, Cohort 9.
</div>
