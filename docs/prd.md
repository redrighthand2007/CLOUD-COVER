# CloudCover
## Insurance Corner — Internal Office Management Web Application

**Product Requirements Document (PRD) + Step-by-Step Development Guide**

**Technology constraint:** Use HTML, CSS and JavaScript wherever practical across the project. Avoid unnecessary frameworks.

---

## 1. Project Overview

CloudCover is an internal web application for Insurance Corner. It is designed for a small office team of approximately 3–4 people to manage customer records, insurance policies, investments and premium/payment due work from one system.

Customers are **NOT application users**. There is no customer login, customer portal or customer mobile app. The office team manages all customer information.

### Primary objectives

- Stop searching through Word/Excel files to find customer and policy information.
- Centralize customer, insurance and investment records.
- Provide a dynamic due queue for upcoming and missed insurance premiums.
- Allow office staff to mark the current premium as paid without deleting the policy record.
- Automatically calculate the next recurring due date from premium frequency.
- Provide fast internal search by customer and policy information.
- Keep the system simple enough for a 3–4 person office.

### Out of scope for V1

- Customer accounts/login/OTP.
- Android/iOS application.
- Customer-facing portal.
- Claims management.
- Commission management.
- Insurer API integrations.
- Automatic WhatsApp/SMS/email communication.
- Full storage of policy PDFs, receipts or KYC documents.
- Family/group-member management.
- Lead/sales CRM.
- Complex task assignment or call-outcome workflow.
- Historical payment ledger.

---

## 2. Users and Roles

| Role | Users | Access | Delete |
|---|---|---|---|
| Admin | Father | Full customer, policy, investment and team management | Yes |
| Admin | Mother | Full customer, policy, investment and team management | Yes |
| Staff | Employee 1 | Operational management of customers, policies, investments and dues | No |
| Staff | Employee 2 | Operational management of customers, policies, investments and dues | No |

---

## 3. Core Product Structure

The application is a single internal web application with role-based access.

- Dashboard
- Customers
- Insurance
- Investments
- Due Queue
- Search
- Team/User Management (Admin only)
- Settings

### Core data relationship

```text
Customer
   ├── Insurance Policies
   └── Investments
```

The same customer master record is reused across both branches.

---

## 4. Customer Master

### Required customer fields

- Customer ID (system generated)
- Full Name
- PAN (unique identity/reference field)
- Primary Phone Number
- Email (optional)
- Address (optional if required by the office)
- Date of Birth (optional, only if useful for policy servicing)
- Created Date
- Last Updated Date

PAN should be treated as a unique business identifier, not as a password. Since customers do not log in, authentication is only for office users.

### Customer actions

- Create customer
- View customer
- Edit customer
- Search/filter customer
- View all linked insurance policies
- View all linked investments
- View current due items
- Archive/delete according to role policy

---

## 5. Insurance Module

### Insurance categories

- Life
- Term
- Pension
- Health
- Mediclaim
- Motor
- Accidental

### Insurance policy fields

- Policy ID
- Customer
- Policyholder PAN
- Insurance category
- Policy company / insurer
- Policy name
- Policy number
- Premium amount
- Total tenure
- Policy start date
- Policy end date
- Premium start date
- Premium end date
- Premium frequency: Monthly / Quarterly / Half-yearly / Yearly / Single Premium
- Next due date
- Current payment status
- Policy status
- Notes (optional)
- Created Date
- Last Updated Date

### Policy status

Status should be derived automatically wherever possible.

Suggested V1 statuses:

- Active
- Due
- Overdue
- Lapsed
- Matured
- Cancelled

The system should distinguish **policy status** from the **current premium payment state**.

A missed current premium should not automatically mean the policy is lapsed unless the configured business rule says so.

---

## 6. Dynamic Due Queue

The due queue must **NOT** be a manually maintained list.

It is generated from policy data and the next due date/current payment state.

### Rules

- Missed/unpaid premiums remain visible until the office marks the current premium as paid.
- Missed items appear at the top and are visually marked as urgent/red.
- Upcoming items are those whose next due date falls within the next 5 days.
- Upcoming items are sorted by due date ascending.
- Queue rows show only:
  - Customer Name
  - Policy Name
  - Date
- Staff opens/searches the customer record separately to see:
  - Phone
  - Policy number
  - Insurer
  - Premium amount
  - Other details
- When staff marks the current due item as Paid, the current due item leaves the active queue.
- For recurring frequencies, the system calculates the next due date automatically.
- For Single Premium, there is no recurring next due date after payment.
- No automatic WhatsApp, SMS, email or call task is created.

### Example

If a monthly premium is due on September 12 and is marked paid, the system calculates the next monthly due date.

The policy remains in the database; only the current due item disappears from the active queue until the next due date enters the 5-day window.

---

## 7. Investments Module

V1 keeps the investment module intentionally basic.

### Fields

- Investment ID
- Customer
- Investment type
- Company / AMC
- Scheme / Product name
- Account / Folio number
- Investment amount
- Start date
- Frequency
- Status
- Notes (optional)

Whether recurring investment/SIP dues should appear in the same 5-day due queue is a business decision to confirm before implementation.

**Safest V1 default:** Keep the due queue insurance-premium-only until this is explicitly enabled.

---

## 8. Document Information

CloudCover does not store full policy documents, receipts or KYC files in V1.

It can store lightweight document/reference information if useful, such as:

- Document type
- Availability
- External folder/reference note

Actual files remain in the office's existing Drive/folder system.

---

## 9. Search

Global/internal search should support:

- Customer full name
- PAN
- Phone number
- Policy number
- Policy name
- Insurance company/insurer
- Investment folio/account number
- Scheme/product name

### Filters

- Insurance category
- Insurer
- Policy status
- Premium frequency
- Due/overdue state
- Investment type
- Active/inactive status

---

## 10. Dashboard

### Recommended dashboard cards

- Total Customers
- Active Insurance Policies
- Upcoming Dues — next 5 days
- Missed/Overdue Dues
- Investments
- Recently Updated Customers/Policies

### Primary dashboard area

The most important area is the **Due Queue**, with missed items first and upcoming items below.

---

## 11. Authentication and Security

Only office-team accounts authenticate to CloudCover.

- Admin and staff accounts are created/managed internally.
- Use secure password authentication or an appropriate office-user authentication provider.
- Use HTTPS in production.
- Enforce role-based authorization on the backend, not only by hiding buttons in the UI.
- Do not expose sensitive PAN information unnecessarily in lists.
- Validate all server-side inputs.
- Use parameterized database queries/ORM protections.
- Keep audit information for important changes such as policy edits and deletions.
- Use regular database backups.
- Do not put secrets/API keys in frontend JavaScript.

---

## 12. UI/UX Requirements

- Desktop-first responsive interface.
- Simple office-dashboard appearance.
- Fast search and minimal clicks.
- Clear table-based data views.
- Large readable due dates.
- Missed dues visually prominent.
- Forms should use standard HTML controls wherever possible.
- Avoid unnecessary animations.
- Use consistent navigation/sidebar.
- Keep the interface usable on laptop screens; mobile responsiveness is secondary.

---

## 13. Recommended Technology Strategy

Because the requirement is to use HTML, CSS and JavaScript wherever possible, CloudCover should avoid an unnecessarily large frontend framework.

### Recommended V1 stack

| Area | Technology |
|---|---|
| Frontend | HTML5 + CSS3 + Vanilla JavaScript (ES Modules) |
| UI | Plain HTML forms, tables, dialogs and CSS components |
| Backend | Node.js + Express.js |
| API | REST API using JavaScript |
| Database | PostgreSQL |
| Database access | node-postgres (`pg`) or a lightweight SQL layer |
| Authentication | Secure server-side sessions or JWT with secure HTTP-only cookies |
| Validation | JavaScript validation on both client and server |
| Development | VS Code + integrated terminal + Git/GitHub |
| Hosting | Any suitable static frontend host plus Node backend and managed PostgreSQL |

A small utility CSS file can be created in-house.

### Why not React/Next.js for V1?

The current scope is an internal CRUD-style business application for 3–4 users.

Vanilla HTML/CSS/JS:

- Keeps the project closer to fundamentals.
- Reduces dependencies.
- Matches the explicit technology preference.
- Is sufficient for the current scope.

A framework can be introduced later if the UI becomes substantially larger.

---

## 14. Suggested Project Structure

```text
cloudcover/
│
├── client/
│   ├── index.html
│   ├── css/
│   │   ├── reset.css
│   │   ├── main.css
│   │   └── components.css
│   │
│   └── js/
│       ├── app.js
│       ├── api.js
│       ├── auth.js
│       ├── dashboard.js
│       ├── customers.js
│       ├── insurance.js
│       ├── investments.js
│       ├── due-queue.js
│       ├── search.js
│       ├── forms.js
│       └── utils.js
│
├── server/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── db/
│   └── validators/
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── .env.example
├── package.json
└── README.md
```

---

## 15. Database Design

### Core tables

- `users`
- `customers`
- `insurers`
- `insurance_policies`
- `investments`
- `audit_logs`

### Important relationships

```text
users → audit_logs

customers → insurance_policies
customers → investments

insurers → insurance_policies
```

- Customers have many insurance policies.
- Customers have many investments.
- Insurers have many insurance policies.
- Users generate audit-log entries for important actions.

### V1 payment-history rule

Do **not** create a payment-history table for V1 because the agreed scope only requires:

- Current payment state
- Next due date

If historical payment tracking becomes necessary later, add it as a separate feature.

---

## 16. API Plan

### Authentication

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Customers

```text
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id     — admin only
```

### Insurance

```text
GET    /api/policies
GET    /api/policies/:id
POST   /api/policies
PUT    /api/policies/:id
DELETE /api/policies/:id     — admin only
POST   /api/policies/:id/mark-paid
```

### Due queue

```text
GET /api/due-queue
GET /api/due-queue?range=5
```

The backend should calculate missed and upcoming states rather than accepting a manually maintained pending list.

### Investments

```text
GET    /api/investments
GET    /api/investments/:id
POST   /api/investments
PUT    /api/investments/:id
DELETE /api/investments/:id     — admin only
```

---

# 17. Step-by-Step Development Guide

## Phase 0 — Freeze Requirements

1. Confirm the final role list: 2 admins + 2 staff (or actual current count).
2. Confirm whether investment/SIP dues belong in the 5-day due queue.
3. Confirm the exact admin deletion/archive rule.
4. Confirm whether address and date of birth are needed in customer records.
5. Confirm the final policy status rules for lapsed/matured/cancelled.

---

## Phase 1 — Create the Project

6. Create a GitHub repository named `cloudcover`.
7. Create the local project folder in VS Code.
8. Initialize Git.
9. Create `client`, `server` and `database` folders.
10. Create the first `README.md` containing the project purpose and scope.
11. Do not start with UI polish; establish the structure first.

---

## Phase 2 — Build the Static Frontend First

12. Create the main HTML layout.
13. Create sidebar/navigation.
14. Create dashboard page.
15. Create customer list and customer form.
16. Create insurance list and policy form.
17. Create investment list and investment form.
18. Create due queue.
19. Create search/filter controls.
20. Use plain CSS for layout, tables, forms and status indicators.
21. Use vanilla JavaScript modules to load data and handle forms.

---

## Phase 3 — Build the Database

22. Install PostgreSQL.
23. Create database `cloudcover`.
24. Write `schema.sql`.
25. Create `users` table.
26. Create `customers` table.
27. Create `insurers` table.
28. Create `insurance_policies` table.
29. Create `investments` table.
30. Create `audit_logs` table.
31. Add primary keys, foreign keys, unique constraints and indexes.
32. Create `seed.sql` with dummy data only.

---

## Phase 4 — Build Backend

33. Initialize Node.js project in `server`.
34. Install Express and PostgreSQL driver.
35. Create database connection module.
36. Create authentication middleware.
37. Create role middleware.
38. Create customer routes/controllers.
39. Create insurance routes/controllers.
40. Create investment routes/controllers.
41. Create due-queue service.
42. Create validation layer.
43. Add centralized error handling.

---

## Phase 5 — Implement Due-Date Engine

44. Create a function that determines whether a due date is missed.
45. Create a function that determines whether a due date is within the next 5 days.
46. Create a function that advances a recurring due date by monthly/quarterly/half-yearly/yearly frequency.
47. Handle month-end dates carefully.
48. Handle single-premium policies separately.
49. Return missed items first, followed by upcoming items sorted by date.
50. When Mark Paid is called, advance `next_due_date` and reset the current payment state.

### Due-date logic concept

```text
                    Policy
                       │
                       ▼
                 next_due_date
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
        Date is past       Date is future
             │                   │
             ▼                   ▼
          MISSED          Within next 5 days?
                                 │
                       ┌─────────┴─────────┐
                       ▼                   ▼
                      YES                  NO
                       │                   │
                       ▼                   ▼
                   UPCOMING             NORMAL
```

### Mark Paid concept

```text
Current premium due
        │
        ▼
   Mark as Paid
        │
        ├── Single Premium → no recurring next due date
        │
        └── Recurring Premium
                  │
                  ▼
          Calculate next due date
                  │
                  ▼
          Update policy record
                  │
                  ▼
        Current item leaves queue
```

---

## Phase 6 — Connect Frontend to API

51. Create a single `client/js/api.js` module for fetch calls.
52. Replace dummy frontend data with API data.
53. Connect customer forms.
54. Connect policy forms.
55. Connect investment forms.
56. Connect due queue.
57. Connect Mark Paid.
58. Add loading, empty and error states.
59. Prevent duplicate form submissions.

---

## Phase 7 — Authentication and Authorization

60. Create office users.
61. Implement login.
62. Protect all backend API routes.
63. Check role on the backend.
64. Hide delete actions for staff in the UI.
65. Also reject staff delete requests on the backend.
66. Add logout.
67. Test unauthorized access directly against the API.

---

## Phase 8 — Testing

68. Test customer creation/edit/search.
69. Test policy creation/edit/search.
70. Test each premium frequency.
71. Test a missed premium.
72. Test a due within 5 days.
73. Test a due more than 5 days away.
74. Test Mark Paid.
75. Test next due date generation.
76. Test single premium.
77. Test admin versus staff permissions.
78. Test invalid PAN/phone/date/amount inputs.
79. Test database failure handling.
80. Test backups and restore before production.

---

## Phase 9 — Deployment

81. Create production PostgreSQL database.
82. Deploy Node.js backend.
83. Deploy static frontend.
84. Configure HTTPS.
85. Set production environment variables.
86. Restrict database access.
87. Create admin accounts securely.
88. Run database migrations/schema.
89. Load only real data that the office has approved for the system.
90. Verify backup/restore.
91. Monitor server errors.

---

# 18. Git/GitHub Workflow

Use the VS Code integrated terminal.

### Initial setup

```bash
git init
git add .
git commit -m "Initial CloudCover project structure"
git branch -M main
git remote add origin <YOUR_GITHUB_REPOSITORY>
git push -u origin main
```

### After changes

```bash
git status
git add .
git commit -m "Describe the change"
git push
```

### Suggested commit style

Use clear, descriptive commits such as:

```text
Add customer database schema
Build customer CRUD API
Add insurance policy form
Implement due queue
Add mark-paid workflow
Add staff role authorization
Fix monthly due-date calculation
```

---

# 19. MVP Definition

CloudCover V1 is complete when the office team can:

- Log in securely.
- Create and search customers.
- Create and manage insurance policies.
- Create and manage investments.
- See a dynamic due queue.
- See missed dues first.
- See upcoming dues for the next 5 days.
- Mark a current premium paid.
- Have the next recurring due date calculated automatically.
- View customer details quickly while following up on dues.
- Operate with admin/staff permissions.
- Use the system reliably from an office laptop.

---

# 20. Future Features — Do Not Build in V1

- Customer portal/login.
- Android/iOS app.
- Claims module.
- Commission tracking.
- WhatsApp integration.
- Automated reminders.
- Insurer API integrations.
- Payment gateway.
- Document vault.
- Historical payment ledger.
- Advanced analytics.
- Multi-branch or multi-tenant support.
- Automated task assignment.

---

# 21. Development Order Summary

Follow this order and do not jump directly into advanced features:

92. Requirements freeze
93. GitHub repository + project structure
94. Static HTML/CSS/JS UI
95. PostgreSQL schema
96. Node.js/Express API
97. Customer CRUD
98. Insurance CRUD
99. Investment CRUD
100. Due-date engine
101. Mark Paid workflow
102. Authentication
103. Role permissions
104. Search/filtering
105. Testing
106. Deployment
107. Real data entry

---

# 22. Important Architecture Rule

Keep CloudCover as a **single-tenant internal office system for Insurance Corner**.

Do not design it as:

- A generic SaaS platform.
- A multi-company insurance marketplace.
- A customer-facing insurance app.

Only expand the architecture if the business requirements change.

---

# 23. Final Technology Decision

| Area | Decision |
|---|---|
| Application type | Responsive internal web application |
| Users | 3–4 office-team members only |
| Customer accounts | No |
| Mobile app | No |
| Frontend | HTML5 + CSS3 + Vanilla JavaScript |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| API | REST |
| Authentication | Office-user authentication |
| Roles | Admin + Staff |
| Insurance | Core module |
| Investments | Basic module |
| Due queue | Dynamic, insurance-premium focused |
| Claims | Out of scope |
| Commissions | Out of scope |
| Full documents | Out of scope |
| Insurer integrations | Out of scope |
| Primary devices | Office laptops/desktops |
| Project name | **CloudCover** |

---

# 24. Pre-Coding Checklist

Before starting implementation, confirm:

- [ ] Investment/SIP due-queue behavior.
- [ ] Deletion versus archive behavior.
- [ ] Final customer fields.
- [ ] Exact automatic policy-status rules.
- [ ] Actual office-user count.
- [ ] Whether all staff can edit all records.
- [ ] Final V1 requirements are frozen.

---

# Final Project Direction

**Project:** CloudCover

**Business:** Insurance Corner

**Purpose:** Internal office management system for customers, insurance policies, investments and insurance premium dues.

**Architecture:** Single-tenant internal web application.

**Frontend:** HTML5 + CSS3 + Vanilla JavaScript.

**Backend:** Node.js + Express.js.

**Database:** PostgreSQL.

**Users:** Office team only.

**Customer login:** None.

**Primary V1 feature:** Dynamic insurance premium due queue with automatic recurring due-date calculation and Mark Paid workflow.

**Development principle:** Build the simplest reliable system that solves the office's current workflow. Avoid unnecessary frameworks and future features until the V1 requirements are proven in real office use.
