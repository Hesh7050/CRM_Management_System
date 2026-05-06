# CRM Lead Management System

A full-stack CRM application for managing sales leads, built with **React**, **Node.js/Express**, and **MySQL**.

---

## Project Structure

```
Heshan/
├── database/
│   ├── schema.sql      ← CREATE TABLE statements
│   ├── seed.sql        ← Sample leads & notes data
│   └── seed.js         ← Setup script (creates DB, hashes password, seeds data)
├── backend/
│   ├── server.js
│   ├── .env            ← Your local config (edit this)
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── config/db.js
│       ├── middleware/auth.js
│       └── routes/
│           ├── auth.js
│           ├── leads.js
│           ├── notes.js
│           └── dashboard.js
├── frontend/
│   ├── index.html
│   ├── vite.config.mjs
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── api/axios.js
│       ├── context/AuthContext.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── LeadForm.jsx
│       │   └── NoteForm.jsx
│       └── pages/
│           ├── LoginPage.jsx
│           ├── DashboardPage.jsx
│           ├── LeadsPage.jsx
│           └── LeadDetailPage.jsx
└── README.md
```

---

## Prerequisites

- **Node.js** v18 or higher — https://nodejs.org
- **MySQL** v8 or higher (running locally)
- **npm** (included with Node.js)

---

## Setup Instructions

### Step 1 — Configure the Database Connection

Open `backend/.env` and set your MySQL credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=crm_db
JWT_SECRET=crm_super_secret_jwt_key_change_me
PORT=5001
```

> If your MySQL root user has no password, leave `DB_PASSWORD=` empty.

---

### Step 2 — Install Backend Dependencies

```bash
cd backend
npm install
```

---

### Step 3 — Set Up the Database

Run the setup script from the `backend` directory. It will:
- Create the `crm_db` database and all tables
- Create the test user (`admin@example.com` / `password123`)
- Insert sample lead and note data

```bash
# Still inside the backend/ folder:
node ../database/seed.js
```

Expected output:
```
Connected to MySQL...
Schema applied (database + tables created if not existing).
Test user created  →  admin@example.com  /  password123
Sample data inserted (leads + notes).
Database setup complete!
```

---

### Step 4 — Start the Backend Server

```bash
# Inside backend/ folder:
npm run dev
```

The API will be available at **http://localhost:5000**

---

### Step 5 — Install Frontend Dependencies & Start

Open a **new terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

The app will open at **http://localhost:5173**

---

## Test Credentials

| Field    | Value                |
|----------|----------------------|
| Email    | admin@example.com    |
| Password | password123          |

---

## Features

| Feature              | Details                                              |
|----------------------|------------------------------------------------------|
| Authentication       | JWT login, protected routes                          |
| Lead Management      | Create, view, edit, delete leads                     |
| Lead Fields          | Name, company, email, phone, source, salesperson, status, deal value |
| Lead Statuses        | New, Contacted, Qualified, Proposal Sent, Won, Lost  |
| Lead Sources         | Website, LinkedIn, Referral, Cold Email, Event       |
| Notes                | Add/delete notes per lead with timestamp & author    |
| Dashboard            | 7 live stats cards including deal values             |
| Search & Filtering   | Filter by status, source, salesperson; full-text search |

---

## API Endpoints

| Method | Endpoint                 | Description              |
|--------|--------------------------|--------------------------|
| POST   | /api/auth/login          | Login and receive JWT    |
| GET    | /api/dashboard           | Dashboard statistics     |
| GET    | /api/leads               | List leads (+ filters)   |
| POST   | /api/leads               | Create a new lead        |
| GET    | /api/leads/:id           | Get a single lead        |
| PUT    | /api/leads/:id           | Update a lead            |
| DELETE | /api/leads/:id           | Delete a lead            |
| GET    | /api/notes/:leadId       | Get notes for a lead     |
| POST   | /api/notes/:leadId       | Add a note to a lead     |
| DELETE | /api/notes/note/:id      | Delete a specific note   |

---

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, React Router v6, Axios, Vite  |
| Backend  | Node.js, Express, JWT, bcryptjs         |
| Database | MySQL 8, mysql2                         |
