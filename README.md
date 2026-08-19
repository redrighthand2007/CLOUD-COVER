# 🛡️ CloudCover (SPA)

> A blazing-fast, Single Page Application (SPA) for modern insurance quoting. Zero frameworks. Pure Vanilla JS.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Glossary/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## 📖 Overview

CloudCover is a fully responsive, client-side web application designed to eliminate quoting delays and agent bias in the insurance selection process. 

Recently refactored into a **Strict Single Page Application (SPA)**, CloudCover leverages a custom Vanilla JS hash router, pure CSS transitions, and modular Javascript views to deliver a seamless, app-like experience without the heavy overhead of frameworks like React or Angular.

## ✨ Features

- **⚡ Blazing Fast SPA Routing**: Custom Javascript hash router (/#quotes, /#bmi) that dynamically injects views without page reloads.
- **🎨 Pure CSS Transitions**: Smooth fade-in animations handled entirely by CSS class toggling during route changes.
- **🧮 Instant Quotation Finder**: Real-time policy filtering and premium calculations based on age, coverage amount, and insurance type.
- **⚖️ Interactive BMI Calculator**: Visual SVG gauge indicating health categories and personalized advice.
- **🔐 AWS Auth-Ready Scaffolding**: Modular authentication structure prepared for seamless AWS Cognito integration.
- **📱 Responsive Glassmorphism UI**: Premium dark-mode aesthetics using a single, consolidated stylesheet.

## 📂 Project Structure

`	ext
CloudCover-Website/
├── index.html              # Master SPA Shell
├── css/
│   └── style.css           # Consolidated Global Styles & Animations
├── docs/
│   └── prd.md              # Product Requirements Document
├── js/
│   ├── router.js           # Vanilla JS Hash Router Core
│   ├── main.js             # Global Utilities (Observers, Auth UI)
│   ├── auth.js             # AWS Cognito Auth Module Scaffold
│   ├── view-home.js        # Home View Template & Logic
│   ├── view-quotes.js      # Quotes Calculator View
│   ├── view-bmi.js         # BMI Tool View
│   ├── view-auth.js        # Login/Signup View
│   ├── view-registration.js# Onboarding Form View
│   ├── view-dashboard.js   # Client Dashboard View
│   ├── view-contact.js     # Contact Us View
│   └── view-notfound.js    # Custom 404 View
└── LICENSE                 # MIT License
`

## 🚀 Getting Started

1. Clone the repository:
   `ash
   git clone https://github.com/redrighthand2007/CloudCover-Website.git
   `
2. Navigate to the project directory:
   `ash
   cd CloudCover-Website
   `
3. Open index.html in your preferred web browser. No local server required!

## 🗺️ Roadmap
- [ ] Integrate AWS Cognito for robust Multi-Factor Authentication (MFA).
- [ ] Connect client-side dashboard to a serverless backend.
- [ ] Implement a payment gateway mockup.

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
