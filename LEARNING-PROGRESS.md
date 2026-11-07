# CloudCover — Learning Progress (from zero to now)

This file walks through CloudCover step by step, as if you were building it again from scratch.
Every row is one thing that exists in the project today (or that you built and then replaced).

**How to use it**

- **Done** — ✅ means the project already has it.
- **Learned** — starts as ⬜. When you can explain that row to someone **without looking at the code**, change it to ✅.
- Go in order. Later steps assume you understand the earlier ones.

---

## Phase 0 — Your computer and tools

| # | Done | Learned | Step / Feature | Explanation |
|---|:---:|:---:|---|---|
| 0.1 | ✅ | ⬜ | Code editor (VS Code) | Where you write code. `CLOUDCOVER.code-workspace` is the VS Code file that remembers how this project's folders are opened. |
| 0.2 | ✅ | ⬜ | Terminal (PowerShell / Git Bash) | A text window where you type commands such as `npm install` or `git commit`. Most developer work starts here. |
| 0.3 | ✅ | ⬜ | Node.js + npm | Node.js runs JavaScript **outside** the browser (on a server). npm is its package manager, which downloads libraries other people wrote. |
| 0.4 | ✅ | ⬜ | PostgreSQL | A database program that stores data in tables (rows and columns). It runs on your PC like any other program. `psql` is its command-line tool. |
| 0.5 | ✅ | ⬜ | Git | Saves "snapshots" (commits) of your code so you can see history and undo mistakes. |
| 0.6 | ✅ | ⬜ | GitHub | A website that stores a copy of your Git project online (`redrighthand2007/CloudCover-Website`). It's your backup and portfolio. |
| 0.7 | ✅ | ⬜ | Browser DevTools (F12) | Inspect HTML, see console errors and watch network requests. This is your main debugging tool for the frontend. |

## Phase 1 — First website: plain HTML, CSS and JS (Aug 3–4, 2026)

| # | Done | Learned | Step / Feature | Explanation |
|---|:---:|:---:|---|---|
| 1.1 | ✅ | ⬜ | `git init` + first commit ("started project") | Turns the folder into a Git repository. The first commit is the starting point of the history. |
| 1.2 | ✅ | ⬜ | `.gitignore` | Lists files Git must **never** save, such as `node_modules/`, `.env` (secrets) and OS junk files like `.DS_Store`. |
| 1.3 | ✅ | ⬜ | `README.md` | The front page of the project on GitHub: what it is, how to install it, how to run it. Written in Markdown. |
| 1.4 | ✅ | ⬜ | `LICENSE` (MIT, later removed) | Says who may use the code. It was removed later because CloudCover is an internal business app ("Internal Use Only"). |
| 1.5 | ✅ | ⬜ | HTML pages (`index.html`, `contactus.html`, `signup.html`, `dashboard.html`, `404.html`…) | HTML is the **structure** of a page: headings, forms, buttons. Each page was a separate file at first. |
| 1.6 | ✅ | ⬜ | CSS (`css/style.css`) | CSS is the **look**: colours, fonts, spacing, layout. One stylesheet shared by all pages keeps the design consistent. |
| 1.7 | ✅ | ⬜ | CSS animations (`css/animations.css`, slide transition) | `@keyframes` and `transition` make elements fade or slide, which makes the site feel smoother. |
| 1.8 | ✅ | ⬜ | JavaScript (`js/main.js`) | JS is the **behaviour**: reacting to clicks, checking forms, changing the page without reloading. |
| 1.9 | ✅ | ⬜ | BMI calculator page | A small practice tool: read inputs, do maths, show the result. It teaches DOM reading and writing (`document.getElementById`, `.value`, `.textContent`). |
| 1.10 | ✅ | ⬜ | Premium quote calculator (`quotes.html`) | Like BMI, but for insurance. First use of real business logic in JS. |
| 1.11 | ✅ | ⬜ | Sign-up / registration forms + validation (`signup.js`, `registration.js`) | Forms collect user input. Client-side validation (checking empty fields, email format) gives instant feedback, but it **can't be trusted** for security (see 6.9). |
| 1.12 | ✅ | ⬜ | Fake login with `localStorage` (`auth.js`) | `localStorage` saves small data in the browser. It's fine for practice, but it isn't real security, which is why a server login came later. |
| 1.13 | ✅ | ⬜ | 404 error page | The page shown when a URL doesn't exist. |
| 1.14 | ✅ | ⬜ | Redesign commits (one page per commit) | Small, focused commits ("redesigned contact page") make the history easy to read and easy to undo. |
| 1.15 | ✅ | ⬜ | Code comments | Notes in the code explaining **why** something is done. |

## Phase 2 — Planning the product

| # | Done | Learned | Step / Feature | Explanation |
|---|:---:|:---:|---|---|
| 2.1 | ✅ | ⬜ | PRD — Product Requirements Document (`docs/prd.md`) | The written plan: who uses the app (Admin, Staff, Customer), which features exist, which are out of scope, the database design and the API plan. Professionals write this **before** coding. |
| 2.2 | ✅ | ⬜ | Implementation plan (Pensieve docs, later deleted) | An early step-by-step build plan. Deleting docs you no longer need keeps the repository clean. |
| 2.3 | ✅ | ⬜ | Defining roles | Admin = full rights, including delete. Staff = daily work but no deleting. Customer = sees only their own data. Every security decision later follows from this. |
| 2.4 | ✅ | ⬜ | Choosing the tech stack | Plain HTML/CSS/JS plus Node/Express plus PostgreSQL, with no React. Simpler to learn and maintain for a small office (PRD §13 explains why). |

## Phase 3 — Single Page App (SPA) version (Aug 19–28, 2026)

| # | Done | Learned | Step / Feature | Explanation |
|---|:---:|:---:|---|---|
| 3.1 | ✅ | ⬜ | Converting to a Single Page App | Instead of many HTML files, one `index.html` stays loaded and JS swaps the content. Moving between pages feels instant. |
| 3.2 | ✅ | ⬜ | Hash router (`js/router.js`) | Reads the URL part after `#` (like `#/dashboard`) and shows the matching "view". This is the core idea behind React Router and similar tools. |
| 3.3 | ✅ | ⬜ | View files (`view-home.js`, `view-auth.js`, `view-bmi.js`, `view-quotes.js`, `view-contact.js`, `view-dashboard.js`, `view-registration.js`, `view-notfound.js`) | Each view is a JS object that returns its HTML and sets up its buttons. One file per screen keeps the code organised. |
| 3.4 | ✅ | ⬜ | Template strings for HTML | Building HTML in JS with backticks: `` `<h1>${name}</h1>` ``. Several "fixed quote marks / html strings" commits came from mistakes here. |
| 3.5 | ✅ | ⬜ | Responsive design ("made it work on phones") | CSS **media queries** (`@media (max-width: 768px)`) change the layout on small screens. |
| 3.6 | ✅ | ⬜ | Flexbox / centering and height bugs | `display:flex`, `justify-content`, `align-items`, `min-height:100vh`. These are the usual tools for centering and full-height layouts, and the usual source of layout bugs. |
| 3.7 | ✅ | ⬜ | Dropdown menus, accordion, file upload UI | Interactive UI parts built by toggling CSS classes with JS. |
| 3.8 | ✅ | ⬜ | Showing the user's first name / profile on the dashboard | Reading user data after login and showing it in the page. |
| 3.9 | ✅ | ⬜ | Recent activity list | Showing a list of items generated from data (looping over an array to build HTML). |
| 3.10 | ✅ | ⬜ | Restructuring folders and cleaning up | Many "cleaned up / restored / finalized folder structure" commits. You learned that Git lets you bring back deleted files when a cleanup goes too far. |

## Phase 4 — First AWS version: serverless (Aug 24–Sep 4, 2026)

| # | Done | Learned | Step / Feature | Explanation |
|---|:---:|:---:|---|---|
| 4.1 | ✅ | ⬜ | AWS account / project | The cloud provider. The CloudCover AWS project is account `448592647758`. |
| 4.2 | ✅ | ⬜ | Amazon Cognito (Hosted UI, implicit flow) | AWS's login service. The first version sent users to Cognito's login page, which sent tokens back in the URL. The "implicit flow" is the older, less secure method (replaced in 9.6). |
| 4.3 | ✅ | ⬜ | Custom Cognito theme (`cognito-theme.css`, logo) | Making AWS's login page match CloudCover's look. |
| 4.4 | ✅ | ⬜ | Amazon API Gateway | Gives your backend a public URL (`https://…execute-api…amazonaws.com/prod/users`). The browser calls this URL. |
| 4.5 | ✅ | ⬜ | AWS Lambda (`backend/lambda-sync.js`) | A function that runs in the cloud only when called. You pay per run, with no server to manage. It received data from API Gateway. |
| 4.6 | ✅ | ⬜ | Amazon DynamoDB (`CloudCoverUsers` table) | AWS's NoSQL database (key → item, no fixed tables or columns). The Lambda saved user profiles here. |
| 4.7 | ✅ | ⬜ | CORS headers | A browser security rule: a page on one website may only call another website if that website allows it (`Access-Control-Allow-Origin`). This is a very common bug when connecting a frontend to an API. |
| 4.8 | ✅ | ⬜ | Sending the token with requests (`Authorization` header) | After login, every API call sends the login token so the backend knows who you are. |
| 4.9 | ✅ | ⬜ | Hosting the frontend (GitHub Pages / Live Server 127.0.0.1:5500) | Serving the static files so a browser can open them. |
| 4.10 | ✅ | ⬜ | Architecture diagram in the README | A picture showing how the pieces connect. Every professional project has one. |
| 4.11 | ✅ | ⬜ | Deciding to rewrite (Sep 11 "Clear old files") | The first version was a practice site. The real office needed relational data (customers → policies → payments), so the backend was rewritten with Node and PostgreSQL. Throwing away a prototype is normal. |

## Phase 5 — Database (PostgreSQL)

| # | Done | Learned | Step / Feature | Explanation |
|---|:---:|:---:|---|---|
| 5.1 | ✅ | ⬜ | Relational database basics | Data lives in **tables**. Each row has an `id` (primary key), and rows link to each other with **foreign keys** (`customer_id REFERENCES customers(id)`). |
| 5.2 | ✅ | ⬜ | `database/schema.sql` | One file that creates every table. Run it once on an empty database. |
| 5.3 | ✅ | ⬜ | `users` table | Office logins: username, **hashed** password, role (Admin/Staff), active flag, `token_version`, `cognito_sub`. |
| 5.4 | ✅ | ⬜ | `customers` table | Customer master data: name, PAN (unique), phone, email, address, date of birth. |
| 5.5 | ✅ | ⬜ | `insurers` table | The list of insurance companies, kept in its own table so names aren't typed differently every time. |
| 5.6 | ✅ | ⬜ | `insurance_policies` table | The main business table: category, premium amount, frequency, start and end dates, `next_due_date`, payment state, status. |
| 5.7 | ✅ | ⬜ | `investments` table | Mutual funds, FDs and SIPs per customer. |
| 5.8 | ✅ | ⬜ | `customer_accounts` table | Customer portal logins (phone + hashed password), one per customer. |
| 5.9 | ✅ | ⬜ | `premium_payments` table | Payment history. Every "Mark Paid" adds a row recording when, how much and who recorded it. |
| 5.10 | ✅ | ⬜ | `audit_logs` table | Records who changed what, with the old and new data saved as JSONB. Important for an office handling money. |
| 5.11 | ✅ | ⬜ | Constraints (`NOT NULL`, `UNIQUE`, `CHECK`) | Rules the database enforces itself. For example, no two customers can share a PAN, and a role must be Admin or Staff. |
| 5.12 | ✅ | ⬜ | `ON DELETE CASCADE` | When a customer is deleted, their policies, investments and account are deleted automatically. |
| 5.13 | ✅ | ⬜ | Indexes (`idx_policies_next_due`…) | Like a book's index: they make searches on those columns fast. |
| 5.14 | ✅ | ⬜ | Trigger for `updated_at` | A small database function that sets `updated_at` to the current time automatically whenever a row changes. |
| 5.15 | ✅ | ⬜ | `NUMERIC(12,2)` for money | Exact decimal numbers. Never use floating point for rupees, because it introduces rounding errors. |
| 5.16 | ✅ | ⬜ | `database/seed.sql` | Fake sample data (Rahul Sharma, Priya Patel, `admin_father`…) so you can test without real customers. |
| 5.17 | ✅ | ⬜ | Migrations (`database/migrations/001`, `002`, `003`) | Upgrade scripts for a database that **already has data**. Instead of deleting and recreating it, they add the new tables and columns. Written to be "safe to run more than once" (`IF NOT EXISTS`). |
| 5.18 | ✅ | ⬜ | `scripts/reset-db.ps1` | Rebuilds the local database from schema + seed. It **refuses** to run on a non-local database, a safety guard against wiping real data. |

## Phase 6 — Backend: Node.js + Express REST API

| # | Done | Learned | Step / Feature | Explanation |
|---|:---:|:---:|---|---|
| 6.1 | ✅ | ⬜ | `package.json` + `npm install` | Lists the libraries the project needs (express, pg, bcryptjs, jsonwebtoken…). `package-lock.json` pins exact versions so every PC installs the same ones. |
| 6.2 | ✅ | ⬜ | `npm run dev` with nodemon | Restarts the server automatically when you save a file. `npm start` runs it normally. |
| 6.3 | ✅ | ⬜ | `.env` and `.env.example` (dotenv) | Secrets and settings (database password, JWT secret) live in `.env`, which is **never committed**. `.env.example` shows which settings are needed, with fake values. |
| 6.4 | ✅ | ⬜ | Startup check for missing settings (`server.js`) | The server refuses to start if `JWT_SECRET` or the database settings are missing. Failing loudly is better than running insecurely. |
| 6.5 | ✅ | ⬜ | Express server (`backend/server.js`) | Listens on port 3000, serves the frontend files and handles `/api/*` requests. |
| 6.6 | ✅ | ⬜ | REST API design | URLs are nouns, methods are actions: `GET /api/customers` (list), `POST` (create), `PUT /:id` (update), `DELETE /:id` (delete). |
| 6.7 | ✅ | ⬜ | Folder pattern: routes → controllers → services | **Routes** map URLs to functions. **Controllers** handle the request and the database queries. **Services** hold shared logic (due dates, audit, Cognito, monitoring). Each file has one job. |
| 6.8 | ✅ | ⬜ | Database connection pool (`backend/db/index.js`) | Reuses a few open database connections instead of opening a new one for every request. |
| 6.9 | ✅ | ⬜ | Parameterized queries (`$1, $2`) | Values are sent separately from the SQL text. This prevents **SQL injection**, one of the most common hacks. |
| 6.10 | ✅ | ⬜ | Transactions (`db.transaction`) | Several queries that must all succeed or all fail. Example: Mark Paid both saves a payment and moves the due date. |
| 6.11 | ✅ | ⬜ | DATE parsed as plain text | Stops dates from shifting by a day because of timezones (India is UTC+5:30). |
| 6.12 | ✅ | ⬜ | Server-side validation (`backend/validators/index.js`) | Checks PAN format, Indian mobile numbers, emails, real dates and positive amounts **on the server**, where users can't bypass it. Browser checks are only for convenience. |
| 6.13 | ✅ | ⬜ | Customers API (`customersController.js`) | Create, list, view, update and delete customers, plus create or turn off a customer's portal login. |
| 6.14 | ✅ | ⬜ | Policies API (`insuranceController.js`) | Create, list, view, update and delete policies, plus Mark Paid and payment history. |
| 6.15 | ✅ | ⬜ | Insurers API (`routes/insurers.js`) | List insurers and add new ones. |
| 6.16 | ✅ | ⬜ | Investments API (`investmentsController.js`) | Create, list, view, update and delete investments. |
| 6.17 | ✅ | ⬜ | Users / Team API (`usersController.js`) | Admin only: add office users, change roles, reset passwords, turn accounts off. |
| 6.18 | ✅ | ⬜ | Search + dashboard API (`searchController.js`, `statsService.js`) | One search box across customers, policies and investments (name, PAN, phone, policy number), plus the summary numbers for the dashboard cards. |
| 6.19 | ✅ | ⬜ | Portal API (`portalController.js`) | Customers get **only their own** policies, investments, dues and payments. |
| 6.20 | ✅ | ⬜ | Error handling (404 for unknown API, 500 handler) | Unknown URLs get a clean "Not found". Crashes return a generic message, so internal details are never shown to users. |
| 6.21 | ✅ | ⬜ | Security headers | `X-Content-Type-Options`, `X-Frame-Options: DENY` (stops other sites from embedding yours), `Referrer-Policy`. |
| 6.22 | ✅ | ⬜ | `trust proxy` | Needed when hosted behind a load balancer so the server sees the real visitor IP, which the rate limiter depends on. |
| 6.23 | ✅ | ⬜ | Graceful shutdown | On Ctrl+C, the server sends its last monitoring data and then closes cleanly. |

## Phase 7 — The business brain: Due Queue engine

| # | Done | Learned | Step / Feature | Explanation |
|---|:---:|:---:|---|---|
| 7.1 | ✅ | ⬜ | Premium frequency → months (`dueQueueService.js`) | Monthly = 1, Quarterly = 3, Half-yearly = 6, Yearly = 12, Single Premium = no next due date. |
| 7.2 | ✅ | ⬜ | `addMonths` with month-end clamping | 31 Jan + 1 month = 28/29 Feb, not 3 March. A classic date bug, handled correctly here. |
| 7.3 | ✅ | ⬜ | `calculateNextDueDate` | Moves the due date forward one period. Returns nothing once the premium end date has passed. |
| 7.4 | ✅ | ⬜ | Missed vs. Upcoming queues (`dueQueueController.js`) | **Missed** = due date already passed and still Pending. **Upcoming** = due within the next 5 days. Lapsed, Matured and Cancelled policies are ignored. |
| 7.5 | ✅ | ⬜ | Mark Paid flow | Saves a payment row, moves `next_due_date` forward and writes an audit entry, all in one transaction. |
| 7.6 | ✅ | ⬜ | Audit service (`auditService.js`) | Logs who did what. If logging fails, the main action still succeeds. |

## Phase 8 — Login and security (the app's own login)

| # | Done | Learned | Step / Feature | Explanation |
|---|:---:|:---:|---|---|
| 8.1 | ✅ | ⬜ | Password hashing with bcrypt | Passwords are never stored. Only a one-way scrambled "hash" is stored, and at login `bcrypt.compare` checks the typed password against it. |
| 8.2 | ✅ | ⬜ | JWT (JSON Web Token) | After login, the server gives the browser a signed token (`kind`, `id`, `role`, `tv`). The browser sends it with every request, and the server checks the signature using `JWT_SECRET`. |
| 8.3 | ✅ | ⬜ | One login endpoint, two types | `POST /api/auth/login` with `type: 'staff'` (username) or `type: 'customer'` (mobile number). |
| 8.4 | ✅ | ⬜ | Session lengths | Office sessions last 10 hours (a work day). Customer sessions last 30 days, which suits a phone app. |
| 8.5 | ✅ | ⬜ | `authenticate` middleware (`middleware/auth.js`) | Runs before protected routes. It checks the token, then re-reads the user from the database, so a role change or disabled account takes effect immediately. |
| 8.6 | ✅ | ⬜ | Role checks (`requireAdmin`, `requireStaff`, `requireCustomer`) | Example: only Admin may DELETE. Staff get "403 You do not have permission". |
| 8.7 | ✅ | ⬜ | Instant logout with `token_version` | Every token carries a version number. Changing a password, resetting it or using "Log out everywhere" increases the number in the database, so all old tokens stop working on every device. |
| 8.8 | ✅ | ⬜ | Change password / log out everywhere | Self-service security for every user. |
| 8.9 | ✅ | ⬜ | Login rate limiter (`middleware/rateLimit.js`) | Too many **failed** logins from one IP → "429 Too Many Requests". This stops password guessing. Successful logins don't count, so a shared office connection isn't blocked. |
| 8.10 | ✅ | ⬜ | Same error for wrong user or wrong password | "Invalid login details" doesn't reveal whether a username exists. |
| 8.11 | ✅ | ⬜ | Escaping HTML (`esc()` in `app.js`) | Customer names are escaped before being placed in the page. This stops **XSS** attacks, where someone types `<script>` as their name. |

## Phase 9 — Frontend: office dashboard + customer portal (Sep 11–Oct 22)

| # | Done | Learned | Step / Feature | Explanation |
|---|:---:|:---:|---|---|
| 9.1 | ✅ | ⬜ | New `frontend/` folder, served by Express | The backend serves the frontend files, so it's one app on one port (localhost:3000). |
| 9.2 | ✅ | ⬜ | ES Modules (`import` / `export`) | Each JS file exports functions that others import. This is the modern way to split code without a framework. |
| 9.3 | ✅ | ⬜ | Shared helpers (`frontend/js/app.js`) | `fetchAPI` (adds the token and handles a 401 by logging out), session save/clear, `formatDate`, `formatMoney` (₹), `esc`. |
| 9.4 | ✅ | ⬜ | One login page with two tabs (`login.html`, `auth.js`) | A Customer tab (mobile number) and an Office tab (username, or the MFA button when Cognito is on). After login, users are sent to the right area based on their role. |
| 9.5 | ✅ | ⬜ | Office dashboard (`dashboard.html`, `dashboard.js`) | Sidebar sections, summary cards and the Due Queue table, with only the needed section's data loaded. |
| 9.6 | ✅ | ⬜ | Customers screen (`customers.js`) | List, add and edit customers through forms in a modal, plus a button to set up a customer's portal login. |
| 9.7 | ✅ | ⬜ | Policies screen + filters (`policies.js`) | List policies with filters (category, status, due state), add and edit them, Mark Paid, view payment history. |
| 9.8 | ✅ | ⬜ | Investments screen (`investments.js`) | List, add and edit investments, with a customer dropdown filled from the API. |
| 9.9 | ✅ | ⬜ | Global search (`search.js`) | Type in one box and results appear as you type, grouped into customers, policies and investments. |
| 9.10 | ✅ | ⬜ | Team page (`team.js`) | Admin only: add users, generate a random password, change roles, turn accounts off. |
| 9.11 | ✅ | ⬜ | My Account (`account.js`) | Change your own password and log out on all devices. |
| 9.12 | ✅ | ⬜ | Hiding Admin-only buttons (`isAdmin()`) | Staff don't see Delete buttons. The **real** protection is on the server (8.6); hiding buttons only keeps the screen tidy. |
| 9.13 | ✅ | ⬜ | Customer portal (`portal.html`, `portal.js`, `portal.css`) | A mobile-first page where a customer sees their upcoming dues, policies, investments, payments and profile. It's read-only. |
| 9.14 | ✅ | ⬜ | CSS split into files (`style.css`, `components.css`, `dashboard.css`, `portal.css`) | Base styles, reusable parts (buttons, modals, badges), and page-specific styles. |

## Phase 10 — PWA: installable on phones

| # | Done | Learned | Step / Feature | Explanation |
|---|:---:|:---:|---|---|
| 10.1 | ✅ | ⬜ | Web app manifest (`manifest.webmanifest`) | Name, icons, theme colour and `display: standalone`. This lets a phone "Add to Home Screen" so the site opens like an app. |
| 10.2 | ✅ | ⬜ | App icons (`icons/`, `scripts/make-icons.js`) | A script that generates the 192px and 512px PNG icons from code. |
| 10.3 | ✅ | ⬜ | Service worker (`sw.js`) | A background script that caches the page "shell" so it opens offline. It works network-first, so updates appear straight away. |
| 10.4 | ✅ | ⬜ | Never caching `/api` or the login callback | Customer data must never be stored on the phone, and the callback URL contains a one-time login code. This is a privacy decision. |
| 10.5 | ✅ | ⬜ | Cache versioning (`cloudcover-v3`) | Changing the version deletes old caches, so users don't get stuck on old files. |

## Phase 11 — AWS for real: Cognito MFA (Oct 22, 2026)

| # | Done | Learned | Step / Feature | Explanation |
|---|:---:|:---:|---|---|
| 11.1 | ✅ | ⬜ | AWS CLI + `aws login --profile cloudcover` | Sign in to AWS from the terminal through the browser. **No access keys** stored in files. |
| 11.2 | ✅ | ⬜ | New AWS experience: project, selected Region `ap-southeast-2` | The project only allows Sydney. Mumbai is blocked by the organization's policy, which is why everything is in Sydney. |
| 11.3 | ✅ | ⬜ | Cognito user pool `cloudcover-office` | The list of office users in AWS. Admins create users and there's no public sign-up. Password policy: 12+ characters with mixed character types. |
| 11.4 | ✅ | ⬜ | MFA required, authenticator app (TOTP) | After the password, users enter a 6-digit code from an app such as Google Authenticator. SMS was avoided because it costs money and needs DLT registration in India. |
| 11.5 | ✅ | ⬜ | Managed login page (v2) + app client `cloudcover-web` | AWS hosts the login page. The app client is public (no secret), because a browser can't keep secrets. |
| 11.6 | ✅ | ⬜ | Authorization code flow + PKCE (`frontend/js/cognito.js`) | The browser makes a random secret (verifier) and sends only its hash. Cognito returns a one-time **code**, and only the browser that holds the verifier can exchange it. This is safer than the old implicit flow (4.2). |
| 11.7 | ✅ | ⬜ | Callback page (`auth-callback.html`) | Cognito redirects here with the code, and the page passes it to the backend. |
| 11.8 | ✅ | ⬜ | Backend token check (`cognitoService.js`, `aws-jwt-verify`) | The server exchanges the code for tokens, verifies the ID token's signature, issuer, audience and expiry, then **revokes** the refresh token and issues CloudCover's own JWT. This keeps roles and instant logout working. |
| 11.9 | ✅ | ⬜ | `cognito_sub` link (migration 003) | The first MFA login saves Cognito's permanent user ID. After that, only that exact Cognito account can log in as that office user. |
| 11.10 | ✅ | ⬜ | `AUTH_PROVIDER=local` / `cognito` switch | A setting in `.env` turns MFA on or off with no code change. When it's on, password-only office login is **blocked**, so nobody can skip MFA. |
| 11.11 | ✅ | ⬜ | `scripts/cognito-add-user.ps1` | Creates an office user in Cognito with a temporary password. The user must set a new password and MFA at first login. |
| 11.12 | ✅ | ⬜ | `docs/aws-cognito-setup.md` | Records exactly what was created, why, the commands used, and how to remove it all in January 2027. |

## Phase 12 — AWS monitoring: CloudWatch, Lambda, EventBridge, SNS (Oct 22, 2026)

| # | Done | Learned | Step / Feature | Explanation |
|---|:---:|:---:|---|---|
| 12.1 | ✅ | ⬜ | AWS SDK for JavaScript v3 (`@aws-sdk/client-cloudwatch`…) | Libraries that let Node code talk to AWS services. |
| 12.2 | ✅ | ⬜ | CloudWatch custom metrics (`monitoringService.js`) | Every 5 minutes the server sends numbers under the namespace `CloudCover`: MissedDues, UpcomingDues, CollectedThisMonth, Logins, LoginFailures, ServerErrors. |
| 12.3 | ✅ | ⬜ | CloudWatch Logs (`/cloudcover/app`) | Every minute the server sends events such as start, stop, logins and errors. Logs are kept for 14 days. |
| 12.4 | ✅ | ⬜ | Privacy rule: no personal data to AWS | Only counts and event names are sent. Names, PAN, phone numbers and passwords are never sent. |
| 12.5 | ✅ | ⬜ | Fail-safe design | If AWS can't be reached, the app keeps working and prints at most one warning every 10 minutes. `AWS_MONITORING=on/off` switches monitoring on or off. |
| 12.6 | ✅ | ⬜ | CloudWatch dashboard (`aws/cloudwatch/dashboard.json`) | One AWS page with graphs of dues, collections, logins, errors and alarms. |
| 12.7 | ✅ | ⬜ | CloudWatch alarms (3) | Emails when: any server error occurs, 10+ failed logins happen in 15 minutes (possible attack), or the daily Lambda fails. |
| 12.8 | ✅ | ⬜ | SNS topic `cloudcover-alerts` | A "broadcast channel" that turns alarms and summaries into emails. The email subscription must be confirmed once. |
| 12.9 | ✅ | ⬜ | Lambda `cloudcover-daily-summary` (`aws/lambda/daily-summary/index.mjs`) | Reads yesterday's metrics from CloudWatch and emails a summary through SNS. It never touches the database, so it works while the app runs on a PC. |
| 12.10 | ✅ | ⬜ | EventBridge Scheduler | Runs the Lambda at `cron(0 8 * * ? *)` Asia/Kolkata, which is 8 AM IST every day, with 2 retries. |
| 12.11 | ✅ | ⬜ | IAM roles + least privilege (`aws/iam/*.json`) | A **trust policy** says who may use the role (Lambda or the Scheduler service). A **permissions policy** says what it may do. The Lambda can only read metrics, write its own logs and publish to one topic. The Scheduler can only invoke one Lambda. |
| 12.12 | ✅ | ⬜ | `aws:SourceAccount` condition | Stops other AWS accounts from using your roles (the "confused deputy" protection). |
| 12.13 | ✅ | ⬜ | AWS Budget (`cloudcover-monthly-50-inr`, about $0.60) | Emails at 50% and 100% of the budget, so a mistake can't run up a bill. Everything currently fits inside the free allowances. |
| 12.14 | ✅ | ⬜ | Tagging (`Project=CloudCover`) | Labels on every resource so you can find them, track their cost and clean them up. |
| 12.15 | ✅ | ⬜ | `docs/aws-monitoring-setup.md` | The diagram, resource list, cost, privacy notes, on/off steps, a test record from 22 Oct, and removal steps. |

## Phase 13 — Documentation, research and project hygiene

| # | Done | Learned | Step / Feature | Explanation |
|---|:---:|:---:|---|---|
| 13.1 | ✅ | ⬜ | Professional README | Badges, features, tech stack, folder tree, install steps, sample logins, configuration, roadmap. |
| 13.2 | ✅ | ⬜ | `setup.md` | Steps to set up the AWS CLI login and the AI agent toolkit on a new PC. |
| 13.3 | ✅ | ⬜ | `CLAUDE.md` | Rules for the AI assistant: AWS Region limits, project terms, help level. |
| 13.4 | ✅ | ⬜ | Clear commit messages | Recent commits explain **what and why** ("Add optional AWS Cognito MFA login for office users"), unlike the early ones ("fixed major issue"). |
| 13.5 | ✅ | ⬜ | Git worktree (`.claude/worktrees/…`) | A second working copy of the repository on another branch, so two pieces of work don't mix. |
| 13.6 | ✅ | ⬜ | Research paper + patent drafts (`VIT-CLOUD-ARCH/`) | Academic write-up of CloudCover for the VIT cloud course. **Not yet committed to Git.** |

---

## Not done yet (next steps before real office use, Jan 2027)

| # | Done | Learned | Step / Feature | Explanation |
|---|:---:|:---:|---|---|
| N.1 | ⬜ | ⬜ | Production hosting | Run the app on a real server (not your PC) with a domain and HTTPS. |
| N.2 | ⬜ | ⬜ | Managed database + automatic backups | Hosted PostgreSQL with daily backups, and a test that you can actually restore one. |
| N.3 | ⬜ | ⬜ | Separate dev and live environments | Testing must never touch real customer data. |
| N.4 | ⬜ | ⬜ | Automated tests | Code that checks the due-date maths, logins and permissions every time you change something. |
| N.5 | ⬜ | ⬜ | CI/CD pipeline | Every push runs the tests and deploys automatically (GitHub Actions). |
| N.6 | ⬜ | ⬜ | Infrastructure as Code | Describe the AWS resources in files (CDK or CloudFormation) instead of creating them by hand with CLI commands. |
| N.7 | ⬜ | ⬜ | User guide + staff training | A short guide for the office: adding customers, Mark Paid, the customer app. |
| N.8 | ⬜ | ⬜ | Decide on AWS for January 2027 | Keep the AWS features or remove them using the "Removing it" sections in the two AWS docs. |

---

**Your progress:** count the ✅ in the **Learned** column. Goal: every row ✅ before January 2027.
