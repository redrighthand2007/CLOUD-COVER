# CloudCover

Internal Office Management Web Application for Insurance Corner.

## Architecture

This application replaces the previous serverless SPA architecture with a secure, internal CRUD management tool built specifically for office staff.

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES Modules)
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT

## Features

- **Customers:** Manage office customer records (no customer logins).
- **Insurance:** Track insurance policies and calculate next premium due dates.
- **Due Queue:** A dynamic dashboard queue that tracks upcoming premiums (next 5 days) and missed premiums.
- **Investments:** Track basic mutual fund, FD, and SIP investments.
- **Role Based Access:** Admin vs. Staff roles protect critical functionality like deleting records.

## Setup

1. Make sure you have PostgreSQL and Node.js installed.
2. Initialize the database schema and seed data using `database/schema.sql` and `database/seed.sql`.
3. In the `server` directory, run `npm install` and then `npm run dev`.
4. The client is purely static HTML/CSS/JS and can be served via any basic web server (e.g. `npx serve client`).

## Roles & Default Logins

The `seed.sql` provides the following accounts:
- `admin_father` / `password123`
- `admin_mother` / `password123`
- `staff_emp1` / `password123`
- `staff_emp2` / `password123`
