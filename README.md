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




## Key Implementation Notes

1. **JWT Auth** — Token is generated on login/register, stored in `localStorage`, and attached to all protected requests via an Axios interceptor. A 401 response auto-redirects to `/login`.

2. **1-to-1 Relationship** — `POST /api/teachers` wraps both inserts in a `transStart()` / `transComplete()` block. If either insert fails, the entire transaction is rolled back.

3. **Password Hashing** — `AuthUserModel` uses a `beforeInsert` hook to bcrypt-hash passwords automatically before any insert.

4. **CORS** — Handled by CodeIgniter's built-in `Cors` filter configured in `Config/Cors.php`.
