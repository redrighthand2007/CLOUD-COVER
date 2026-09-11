<div align="center">
  <h1>☁️ CloudCover</h1>
  <p><b>An elegant, internal office management application tailored for Insurance Corner.</b></p>
  
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](#)
  [![Vanilla JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
</div>

---

<br>

## 🚀 Overview

**CloudCover** is an internal, single-tenant web application explicitly designed for a small office team (3-4 members). It centralizes customer records, complex insurance policies, investments, and premium collections. 

**Note:** This is *strictly* an internal administrative tool. There are no customer-facing portals, OTP logins, or mobile apps in V1.

<br>

## ✨ Core Modules (MVP)

- 👥 **Customer Master:** Centralized repository for PAN, contact info, and linked policies/investments.
- 🛡️ **Insurance Module:** Logs multiple categories of policies (Life, Health, Motor, etc.) and auto-computes recurring premium dates.
- ⚡ **Dynamic Due Queue:** The heart of the dashboard. Automatically calculates and prioritizes missed premiums and upcoming dues (next 5 days) without manual tracking.
- 📈 **Investments Module:** Lightweight tracking for Mutual Funds, FDs, and SIPs.
- 🔍 **Global Search:** Fast internal lookups by name, PAN, phone, or policy number.
- 🔒 **Role-Based Security:** 
  - **Admin:** Full rights (including archival/deletion).
  - **Staff:** Operational management (CRUD without deletion capabilities).

<br>

## 🛠️ Architecture & Tech Stack

Per the PRD constraints, CloudCover intentionally avoids heavy frontend frameworks to keep the project close to fundamentals, highly maintainable, and aligned with the small-office scope.

| Layer       | Technology |
| ----------- | ----------- |
| **Frontend**| HTML5, CSS3, Vanilla JavaScript (ES Modules) |
| **Backend** | Node.js, Express.js REST API |
| **Database**| PostgreSQL (accessed via `pg`) |
| **Security**| JWT Authentication (Server-side validation) |

<br>

## ⚙️ Development Setup

1. **Database Initialization**
   Ensure PostgreSQL is installed. Create a database named `cloudcover`, then initialize the schema and seed data:
   ```bash
   psql -U postgres -d cloudcover -f database/schema.sql
   psql -U postgres -d cloudcover -f database/seed.sql
   ```

2. **Backend Services**
   Navigate to the repository root, install dependencies, and start the local dev server:
   ```bash
   npm install
   npm run dev
   ```

3. **Frontend Access**
   The application static files are served by Express. Open your browser and navigate to:
   **`http://localhost:3000`**

<br>

## 🔑 Default Seed Accounts

Use these accounts to test the role-based dashboard views:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin_father` | `password123` |
| **Admin** | `admin_mother` | `password123` |
| **Staff** | `staff_emp1` | `password123` |
| **Staff** | `staff_emp2` | `password123` |

<br>

## 🔮 Future Scope (Out of V1)

While CloudCover is designed to be extensible, the following are explicitly deferred to future phases:
- Customer Portal / Mobile Apps
- WhatsApp / SMS / Email automation
- Insurer API integrations
- Complex task assignment workflows
- Full document/PDF storage vault

<br>

<div align="center">
  <sub>Built for performance. Designed for the Insurance Corner team.</sub>
</div>
