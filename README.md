<div align="center">
  <h1>☁️ CloudCover</h1>
  <p><b>A minimalist, robust Internal Office Management Web Application for Insurance Corner.</b></p>
  
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](#)
  [![Vanilla JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
</div>

---

<br>

## 🚀 Overview

**CloudCover** is built specifically for office staff to effortlessly track customers, insurance policies, and investments in one centralized system. Designed to replace scattered spreadsheets, it brings clarity and structure to the daily workflow.

<br>

## ✨ Key Features

- 👥 **Customer Management:** Maintain comprehensive profiles for all office customers in one place.
- 🛡️ **Insurance Tracking:** Log policies across multiple providers and automatically compute the next premium due dates based on payment frequencies.
- ⚡ **Dynamic Due Queue:** A real-time dashboard queue that highlights urgent missed premiums and upcoming payments within the next 5 days.
- 📈 **Investment Logging:** Simple tracking for mutual funds, fixed deposits, and SIPs.
- 🔒 **Role-Based Security:** Distinct `Admin` and `Staff` access levels to safeguard critical operations, such as record deletions.

<br>

## 🛠️ Technology Stack

CloudCover avoids heavy frontend frameworks to remain lean, fast, and highly maintainable:

| Layer       | Technology |
| ----------- | ----------- |
| **Frontend**| HTML5, CSS3, Vanilla JavaScript (ES Modules) |
| **Backend** | Node.js, Express.js |
| **Database**| PostgreSQL |
| **Security**| JWT Authentication |

<br>

## ⚙️ Quick Setup

1. **Database Preparation**
   Ensure PostgreSQL is installed. Initialize the schema and seed data using the files in the `/database` folder:
   ```bash
   psql -U postgres -d cloudcover -f database/schema.sql
   psql -U postgres -d cloudcover -f database/seed.sql
   ```

2. **Backend Services**
   Install the dependencies and start the local development server:
   ```bash
   npm install
   npm run dev
   ```

3. **Frontend Launch**
   The application is served directly by the backend. Simply open your browser and navigate to:
   **`http://localhost:3000`**

<br>

## 🔑 Default Accounts

The `seed.sql` pre-populates the database with the following test accounts:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin_father` | `password123` |
| **Admin** | `admin_mother` | `password123` |
| **Staff** | `staff_emp1` | `password123` |
| **Staff** | `staff_emp2` | `password123` |

<br>

<div align="center">
  <sub>Built for performance. Designed for simplicity.</sub>
</div>
