<div align="center">
  
  <h1>☁️ CloudCover</h1>
  <p><b>An elegant, internal office management web application tailored for Insurance Corner.</b></p>
  
  <!-- Badges -->
  <p>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" /></a>
    <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" /></a>
    <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
  </p>

</div>

---

## 📸 Preview / Demo

> *Note: Insert a GIF or screenshot of the running CloudCover dashboard here!*
> 
> `![CloudCover Dashboard Demo](./docs/demo.gif)`

---

## ✨ Features

- 👥 **Customer Master Data:** Maintain comprehensive profiles for all office customers, linking policies and investments seamlessly.
- 🛡️ **Insurance Tracking:** Log multiple categories of policies (Life, Health, Motor) and automatically compute recurring premium dates.
- ⚡ **Dynamic Due Queue:** The heart of the dashboard. Automatically calculates and prioritizes missed premiums and upcoming dues (next 5 days) without manual tracking.
- 📈 **Investments Module:** Lightweight tracking for Mutual Funds, FDs, and SIPs.
- 🔍 **Global Search:** Fast internal lookups by name, PAN, phone, or policy number.
- 🔒 **Role-Based Security:** Strict `Admin` (full rights) and `Staff` (operational management, no deletion) access levels.

---

## 🎯 Why This Project?

**The Problem:** Small insurance offices often rely on scattered Excel spreadsheets, Word documents, and physical files. This makes it incredibly difficult to track upcoming premium dues, manage customer portfolios, and ensure nothing falls through the cracks.

**The Solution:** CloudCover is a purpose-built, single-tenant internal tool designed strictly for office staff (3-4 members). It brings clarity and structure to the daily workflow by replacing manual tracking with a dynamic, automated dashboard.

---

## 🛠️ Tech Stack

Built for speed, simplicity, and maintainability without the overhead of heavy frameworks.

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES Modules)
- **Backend:** Node.js, Express.js (REST API)
- **Database:** PostgreSQL (via `pg`)
- **Security:** JWT Authentication (Server-side validation)
- **Deployment:** Ready for cloud hosting (Render, AWS, Heroku)

---

## 📁 Project Structure

```text
cloudcover/
├── backend/               # Node.js Express server
│   ├── controllers/       # Route logic and database queries
│   ├── db/                # Database connection pool
│   ├── middleware/        # JWT Authentication & Role checks
│   ├── routes/            # API endpoints
│   └── server.js          # Entry point
├── database/              # SQL Initialization scripts
│   ├── schema.sql         # Table creation
│   └── seed.sql           # Dummy test data
├── docs/                  # Documentation (PRD, plans)
├── frontend/              # Vanilla JS Frontend (SPA)
│   ├── css/
│   ├── js/
│   ├── dashboard.html     # Main application interface
│   └── index.html         # Login gateway
├── .env                   # Environment variables (Create this!)
└── README.md
```

---

## ⚙️ Installation

Follow these steps to set up the project locally for development.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/redrighthand2007/CloudCover-Website.git
   cd CloudCover-Website
   ```

2. **Initialize the Database:**
   Make sure PostgreSQL is installed and running.
   ```bash
   psql -U postgres -c "CREATE DATABASE cloudcover;"
   psql -U postgres -d cloudcover -f database/schema.sql
   psql -U postgres -d cloudcover -f database/seed.sql
   ```

3. **Install Backend Dependencies:**
   ```bash
   npm install
   ```

---

## 🚀 Usage

1. **Start the Development Server:**
   ```bash
   npm run dev
   ```
2. **Access the Application:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000). The Express server will automatically serve the static frontend files.

---

## 🔧 Configuration

Create a `.env` file in the root of the project with the following variables:

```env
# Server Configuration
PORT=3000

# PostgreSQL Database Configuration
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cloudcover

# Security
JWT_SECRET=super_secret_key_change_in_production
```

---

## 🧠 How It Works

CloudCover operates on a lightweight **Single Page Application (SPA)** architecture without using React or Vue:
1. **Routing:** The backend routes API requests under `/api/*` and serves frontend files for all other routes.
2. **State:** The frontend uses ES Modules to fetch JSON data from the Express backend and dynamically updates the DOM.
3. **Engine:** The *Dynamic Due Queue* logic happens server-side, computing dates dynamically against the current system time to sort missed vs. upcoming premiums.

---

## 🗺️ Roadmap

- [x] Setup PostgreSQL schema and seed data
- [x] Build backend REST API and authentication layer
- [x] Construct Vanilla JS frontend structure
- [x] Wire up HTML forms for CRUD operations
- [x] Implement dynamic Due Queue logic
- [x] Add Admin vs. Staff role restrictions
- [x] Create instant search/filtering UI
- [ ] **Comprehensive Testing** (Next Step)
- [ ] **Production Deployment Setup**

---

## 🤝 Contributing

This is an internal business application. If you are part of the internal dev team and wish to contribute:
1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

---

## 📄 License

Internal Use Only. Copyright © 2026 Insurance Corner.

---

## 👨‍💻 Author

**Kush Aghera (redrighthand2007)**
- GitHub: [@redrighthand2007](https://github.com/redrighthand2007)
- Email: redrighthand2007@gmail.com

---

## ⭐ Acknowledgements

- Built specifically to optimize the workflow at Insurance Corner.
- Core architecture decisions guided by the internal Product Requirements Document (PRD).

<div align="center">
  <sub>Built for performance. Designed for simplicity.</sub>
</div>
