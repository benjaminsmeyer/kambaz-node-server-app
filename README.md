# Kambaz Node Server App

Node.js + Express backend for the Kambaz learning management system (LMS). The API supports users, courses, modules, assignments, and enrollments, and is designed to work with a separate frontend client.

## Purpose

This project provides the server-side API for Kambaz so students and instructors can:

- Create and manage courses
- Organize course content into modules
- Create and manage assignments
- Enroll and unenroll users in courses
- Sign up, sign in, and manage profile/session state

The application uses session-based authentication and role checks for protected operations (for example, faculty-only user management actions).

## Tech Stack

- Node.js
- Express
- express-session
- CORS
- dotenv

## Quick Start

## 1) Prerequisites

- Node.js 18+
- npm

## 2) Install dependencies

```bash
npm install
```

## 3) Configure environment

Create a `.env` file in the project root (or update the existing one):

```env
SERVER_ENV=development
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:4000
SESSION_SECRET=super secret session phrase
PORT=4000
```

Notes:

- `CLIENT_URL` is the frontend origin allowed by CORS.
- `SESSION_SECRET` should be changed for real deployments.
- In non-development environments, cookies are configured as secure with `sameSite: "none"`.

## 4) Start the server

```bash
npm start
```

The server runs on:

- `http://localhost:4000` (or the `PORT` value you set)

## Scripts

- `npm start` - Starts the Express server
- `npm test` - Placeholder script (currently exits with an error)

## API Overview

Base path: `/api`

### Users

- `POST /api/users/signup` - Register and create a session
- `POST /api/users/signin` - Authenticate and create a session
- `POST /api/users/signout` - End the current session
- `POST /api/users/profile` - Get current signed-in user
- `PUT /api/users/profile` - Update current signed-in user
- `GET /api/users`, `GET /api/users/:userId`, `PUT /api/users/:userId`, `DELETE /api/users/:userId`

### Courses

- `GET /api/courses`, `GET /api/courses/:courseId`
- `POST /api/courses` and `POST /api/users/current/courses`
- `PUT /api/courses/:courseId`, `DELETE /api/courses/:courseId`
- `GET /api/users/:userId/courses`

### Modules

- `GET /api/modules`, `GET /api/modules/:moduleId`
- `POST /api/modules`
- `PUT /api/modules/:moduleId`, `DELETE /api/modules/:moduleId`
- `POST /api/courses/:courseId/modules`, `GET /api/courses/:courseId/modules`

### Assignments

- `GET /api/assignments`, `GET /api/assignments/:assignmentId`
- `POST /api/assignments`
- `PUT /api/assignments/:assignmentId`, `DELETE /api/assignments/:assignmentId`
- `POST /api/courses/:courseId/assignments`, `GET /api/courses/:courseId/assignments`

### Enrollments

- `GET /api/enrollments`, `GET /api/enrollments/:enrollmentId`
- `POST /api/enrollments`
- `PUT /api/enrollments/:enrollmentId`, `DELETE /api/enrollments/:enrollmentId`
- `GET /api/users/:userId/enrollments`
- `GET /api/courses/:courseId/enrollments`
- `POST /api/users/:userId/courses/:courseId`
- `DELETE /api/users/:userId/courses/:courseId`

Some user-scoped routes accept `current` in place of `:userId` and resolve it from the active session.

## Project Structure

```text
kambaz/
  users/
  courses/
  modules/
  assignments/
  enrollments/
  database/
Lab5/
Hello.js
index.js
```

- `kambaz/*` contains the core Kambaz API resources.
- `kambaz/database/*` currently uses in-memory JavaScript data.
- `Lab5/*` includes class/lab exercises and examples.
- `Hello.js` provides simple health/demo endpoints.

## Development Notes

- Data is stored in memory (not a persistent database). Restarting the server resets runtime changes.
- Sessions require browser/client support for cookies.
- CORS is enabled with credentials and uses `CLIENT_URL` as allowed origin.

## Entry Point

- `index.js` initializes middleware, routes, and server startup.
