# Teacher Portal

A full-stack web application built with **CodeIgniter 4** (REST API) and **ReactJS** (frontend), featuring JWT-based authentication and a 1-to-1 relational database design between `auth_user` and `teachers`.

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Backend   | CodeIgniter 4 (PHP 8.1+)                        |
| Auth      | JWT via `firebase/php-jwt`                      |
| Database  | MySQL 5.7+ / MySQL 8.0+ (or PostgreSQL)         |
| Frontend  | React 18 + Vite + TailwindCSS                   |
| State     | React Context API                               |
| Tables    | TanStack Table v8                               |
| Forms     | React Hook Form                                 |
| HTTP      | Axios (with JWT interceptors)                   |

---

## Project Structure

```
teacher-portal/
├── backend/                   # CodeIgniter 4 API
│   ├── app/
│   │   ├── Config/
│   │   │   ├── App.php
│   │   │   ├── Cors.php
│   │   │   ├── Filters.php    ← registers JwtFilter
│   │   │   └── Routes.php     ← all API routes
│   │   ├── Controllers/
│   │   │   ├── BaseController.php
│   │   │   ├── AuthController.php
│   │   │   └── TeacherController.php
│   │   ├── Filters/
│   │   │   └── JwtFilter.php  ← JWT middleware
│   │   └── Models/
│   │       ├── AuthUserModel.php
│   │       └── TeacherModel.php
│   ├── database/
│   │   ├── migrations/        ← CI4 migration files
│   │   └── teacher_portal.sql ← ready-to-import SQL dump
│   ├── composer.json
│   └── .env
│
└── frontend/                  # React + Vite app
    ├── src/
    │   ├── api/
    │   │   ├── axios.js       ← Axios instance + interceptors
    │   │   └── index.js       ← authAPI, teacherAPI functions
    │   ├── components/
    │   │   ├── auth/
    │   │   │   └── ProtectedRoute.jsx
    │   │   ├── layout/
    │   │   │   ├── AppLayout.jsx
    │   │   │   └── Sidebar.jsx
    │   │   ├── teachers/
    │   │   │   └── TeacherForm.jsx
    │   │   └── ui/
    │   │       ├── DataTable.jsx
    │   │       ├── Modal.jsx
    │   │       └── StatCard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── TeachersPage.jsx
    │   │   └── UsersPage.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## Database Schema

### `auth_user`
| Column      | Type         | Notes                  |
|-------------|--------------|------------------------|
| id          | INT PK AI    |                        |
| email       | VARCHAR(255) | Unique                 |
| first_name  | VARCHAR(100) |                        |
| last_name   | VARCHAR(100) |                        |
| password    | VARCHAR(255) | bcrypt hashed          |
| phone       | VARCHAR(20)  | Nullable               |
| is_active   | TINYINT(1)   | Default 1              |
| created_at  | DATETIME     |                        |
| updated_at  | DATETIME     |                        |

### `teachers`
| Column           | Type                    | Notes                         |
|------------------|-------------------------|-------------------------------|
| id               | INT PK AI               |                               |
| user_id          | INT FK → auth_user.id   | Unique (1-to-1 relationship)  |
| university_name  | VARCHAR(255)            |                               |
| gender           | ENUM(male,female,other) |                               |
| year_joined      | YEAR                    |                               |
| department       | VARCHAR(150)            |                               |
| designation      | VARCHAR(150)            |                               |
| subject          | VARCHAR(150)            |                               |
| experience_years | INT                     | Nullable                      |
| bio              | TEXT                    | Nullable                      |
| created_at       | DATETIME                |                               |
| updated_at       | DATETIME                |                               |

---

## Setup Instructions

### Prerequisites
- PHP 8.1+
- Composer
- MySQL 5.7+ or PostgreSQL
- Node.js 18+
- npm or yarn

---

### 1. Database Setup

**Option A — Import SQL dump (fastest):**
```bash
mysql -u root -p < backend/database/teacher_portal.sql
```

**Option B — Create manually and run migrations:**
```sql
CREATE DATABASE teacher_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Then run migrations (step 3 below).

---

### 2. Backend Setup

```bash
cd backend

# Install PHP dependencies
composer install

# Copy and configure environment
cp .env.example .env
# OR edit .env directly
```

Edit `backend/.env`:
```ini
CI_ENVIRONMENT = development
app.baseURL = 'http://localhost:8080/'

database.default.hostname = localhost
database.default.database = teacher_portal
database.default.username = root
database.default.password = YOUR_MYSQL_PASSWORD
database.default.DBDriver = MySQLi

JWT_SECRET = change-this-to-a-long-random-string
JWT_EXPIRY = 3600
```

**For PostgreSQL**, change:
```ini
database.default.DBDriver = Postgre
database.default.port = 5432
```

**Run migrations** (if you didn't import the SQL dump):
```bash
php spark migrate --all
```

**Start the development server:**
```bash
php spark serve
# API running at http://localhost:8080
```

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# App running at http://localhost:3000
```

> **Note:** Vite proxies `/api` → `http://localhost:8080` automatically.  
> If your backend runs on a different port, update `vite.config.js`.

**Build for production:**
```bash
npm run build
```

---

## API Reference

All protected routes require header:
```
Authorization: Bearer <token>
```

### Auth Endpoints

| Method | Endpoint              | Auth | Description          |
|--------|-----------------------|------|----------------------|
| POST   | /api/auth/register    | ✗    | Register new user    |
| POST   | /api/auth/login       | ✗    | Login, get token     |
| GET    | /api/auth/me          | ✓    | Get current user     |
| POST   | /api/auth/logout      | ✓    | Logout (stateless)   |
| GET    | /api/users            | ✓    | List all users       |

#### POST /api/auth/register
```json
{
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "secret123",
  "phone": "+1-555-0100"
}
```

#### POST /api/auth/login
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJ0eXAiOiJKV1Qi...",
  "user": { "id": 1, "email": "john@example.com", ... }
}
```

---

### Teacher Endpoints (all protected)

| Method | Endpoint              | Description                              |
|--------|-----------------------|------------------------------------------|
| GET    | /api/teachers         | List all teachers (joined with user)     |
| GET    | /api/teachers/:id     | Get single teacher                       |
| POST   | /api/teachers         | Create user + teacher (transaction)      |
| PUT    | /api/teachers/:id     | Update teacher + user fields             |
| DELETE | /api/teachers/:id     | Delete teacher + user (cascade)          |

#### POST /api/teachers — Combined payload
```json
{
  "email": "jane@stanford.edu",
  "first_name": "Jane",
  "last_name": "Smith",
  "password": "secret123",
  "phone": "+1-555-0200",
  "university_name": "Stanford University",
  "gender": "female",
  "year_joined": 2018,
  "department": "Mathematics",
  "designation": "Assistant Professor",
  "subject": "Linear Algebra",
  "experience_years": 6,
  "bio": "Passionate about applied mathematics."
}
```

This single endpoint atomically inserts into **both** `auth_user` and `teachers` in a database transaction, maintaining the 1-to-1 foreign key relationship.

---

## Frontend Pages

| Route        | Page            | Description                              |
|--------------|-----------------|------------------------------------------|
| /login       | Login           | JWT login form                           |
| /register    | Register        | Account creation                         |
| /dashboard   | Dashboard       | Stats overview + gender chart + recent   |
| /teachers    | Teachers        | Full CRUD datatable (search, sort, page) |
| /users       | Users           | Auth users datatable (read-only)         |

---

## Sample Login Credentials (from SQL seed)

All sample users have password: **`password`**

| Email                      | Name          |
|----------------------------|---------------|
| john.doe@example.com       | John Doe      |
| jane.smith@example.com     | Jane Smith    |
| alice.wong@example.com     | Alice Wong    |

---

## Key Implementation Notes

1. **JWT Auth** — Token is generated on login/register, stored in `localStorage`, and attached to all protected requests via an Axios interceptor. A 401 response auto-redirects to `/login`.

2. **1-to-1 Relationship** — `POST /api/teachers` wraps both inserts in a `transStart()` / `transComplete()` block. If either insert fails, the entire transaction is rolled back.

3. **Password Hashing** — `AuthUserModel` uses a `beforeInsert` hook to bcrypt-hash passwords automatically before any insert.

4. **CORS** — Handled by CodeIgniter's built-in `Cors` filter configured in `Config/Cors.php`.
