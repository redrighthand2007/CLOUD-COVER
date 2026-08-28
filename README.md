# ☁️ CloudCover Insurance

[![Frontend](https://img.shields.io/badge/Frontend-Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()
[![Auth](https://img.shields.io/badge/Security-AWS_Cognito-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)]()
[![Database](https://img.shields.io/badge/Database-DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white)]()
[![Hosting](https://img.shields.io/badge/Hosting-GitHub_Pages-181717?style=for-the-badge&logo=github&logoColor=white)]()

> **Instant Quotes. Zero Agent Bias. A modern serverless approach to securing your future.**

---

## 🚀 Overview

CloudCover is a cutting-edge, **Single Page Application (SPA)** built entirely without heavy frontend frameworks. By leveraging pure Vanilla JavaScript, custom hash-routing, and a serverless AWS backend, CloudCover delivers a blazing-fast, secure, and seamless user experience for modern insurance management.

## ✨ Key Features

- **⚡ Custom SPA Router:** A lightweight, vanilla JavaScript hash-router that updates views instantly without page reloads.
- **🔐 Enterprise Security:** Integrated with **AWS Cognito** for robust User Identity management, OAuth2 token issuance, and MFA capabilities.
- **📊 Dynamic JWT Dashboard:** Automatically decodes JSON Web Tokens locally to securely greet users and parse profile data (Name, Gender, Email) without making redundant database queries.
- **☁️ Serverless Ready:** Pre-configured to sync user data directly to **Amazon DynamoDB** via **AWS Lambda** and API Gateway.
- **🎨 Glassmorphism UI:** A sleek, modern, dark-themed interface built with pure CSS, dynamic variables, and Intersection Observers for beautiful scroll animations.

## 🏗️ Architecture Stack

### Frontend (Client-Side)
* **HTML5 & CSS3:** Semantic structure with native CSS animations and flexbox/grid layouts.
* **Vanilla JavaScript (ES6+):** No React, No Vue, No dependencies. Pure DOM manipulation and routing.
* **Local Storage:** Secure, ephemeral storage of OIDC identity tokens for seamless session persistence.

### Backend (AWS Cloud)
* **Amazon Cognito:** User Pools, Custom Hosted UI, and JWT issuance.
* **AWS API Gateway:** RESTful endpoints securing the backend functions.
* **AWS Lambda:** Serverless compute for processing dashboard syncing.
* **Amazon DynamoDB:** Highly scalable NoSQL database for flexible user record storage.

## 📂 Project Structure

```text
CloudCover-Website/
├── css/
│   └── styles.css          # Global styles, variables, and animations
├── js/
│   ├── router.js           # Custom SPA Hash Router
│   ├── auth.js             # AWS Cognito Auth Module & Token parsing
│   ├── view-dashboard.js   # Secured user dashboard component
│   └── ...                 # Additional modular view components
└── index.html              # Main application entry point
```

## 🛠️ Getting Started

To run this project locally and explore the architecture:

1. Clone the repository:
   ```bash
   git clone https://github.com/redrighthand2007/CloudCover-Website.git
   ```
2. Navigate to the project directory:
   ```bash
   cd CloudCover-Website
   ```
3. Start a local server (e.g., using Python or VS Code Live Server):
   ```bash
   python -m http.server 8000
   ```
4. Open `http://localhost:8000` in your web browser.

---
*Built with passion, pure code, and the AWS Cloud.*
