# Next.js Auth & CRUD Template

A production-ready Next.js application featuring JWT authentication, role-based authorization, and secure CRUD operations built with Prisma.


## Overview

This project is a full-stack Next.js template designed for real-world applications.  
It demonstrates how to implement secure authentication, authorization, and CRUD operations with a clean and scalable architecture.

The project focuses on correctness, security, and maintainability rather than demo-level shortcuts.


## Features

- JWT-based authentication
- Credentials and GitHub OAuth login
- Role-based authorization (ADMIN / USER)
- Secure server-side access control
- Client-side UX guards
- Full CRUD operations
- Paginated user listing
- Prisma ORM with PostgreSQL
- Type-safe codebase using TypeScript
- Production-ready project structure


## Tech Stack

- Next.js (App Router for UI, Pages Router for API routes)
- NextAuth.js (JWT strategy)
- Prisma ORM
- PostgreSQL
- TypeScript


## Authentication & Authorization

- JWT strategy is used for session management.
- User role is embedded into the JWT at login.
- No database lookup is required on every request.
- Server-side authorization is enforced on all protected API routes.
- Client-side checks are used only for user experience, not security.


## User Roles

- USER  
    - Can manage their own account  
    - Can update or delete their own profile  

- ADMIN  
    - Can view all users  
    - Can update or delete any user  


## Environment Variables

Create a `.env.local` file using the provided `.env.example`.

Required variables:

- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- GITHUB_ID
- GITHUB_SECRET


## Getting Started

1. Install dependencies:
    ```bash
    npm install
    npx prisma migrate dev
    npm run dev
    ```

## API Routes (Overview)

- POST /api/user/Create/create_user - Create user
- GET /api/user/Read/user/[id] - Get user by id (ADMIN)
- GET /api/user/Read/list – Paginated list of users (ADMIN)
- GET /api/user/Read/me – Current authenticated user
- PUT /api/user/Update/update – Update user data
- DELETE /api/user/delete/delete – Delete user


## Security Notes

- All sensitive operations are validated server-side
- Role checks are enforced in API routes
- Client-side checks are used only for UX, never for authorization


## Who This Is For

- Developers building SaaS or admin dashboards
- Teams needing role-based access control
- Projects requiring secure authentication without complexity

## License

MIT
