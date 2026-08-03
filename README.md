# 🛡️ Insurance Corner

> A modern, client-side insurance portal featuring dynamic premium calculation, BMI health checking, and AWS Cognito-ready architecture.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Glossary/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## 📖 Overview

Insurance Corner is a fully responsive, static web application designed to eliminate quoting delays and agent bias in the insurance selection process. Built as a showcase of modern frontend development, it leverages pure HTML, CSS (Glassmorphism), and JavaScript to deliver instant, algorithm-driven policy recommendations.

## ✨ Features

- **⚡ Instant Quotation Finder**: Real-time policy filtering and premium calculations based on age, coverage amount, and insurance type.
- **❤️ Interactive BMI Calculator**: Visual SVG gauge indicating health categories and personalized advice.
- **🔐 AWS Auth-Ready Scaffolding**: Modular authentication structure prepared for seamless AWS Cognito integration.
- **📱 Responsive Glassmorphism UI**: Premium dark-mode aesthetics with dynamic CSS animations and hover effects.
- **📝 Multi-Step Registration**: Smooth onboarding wizard with robust client-side validation (Regex).

## 📁 Project Structure

```text
Insurance-Corner/
├── index.html              # Landing Page
├── signup.html             # Client Login / Registration
├── quotes.html             # Quotation Finder
├── bmi.html                # BMI Calculator
├── contactus.html          # Contact & Support
├── registrationform.html   # Multi-step Applicant Form
├── css/
│   ├── style.css           # Core Design System
│   └── animations.css      # Keyframes & Transitions
├── js/
│   ├── main.js             # Global UI interactions
│   ├── auth.js             # AWS Cognito Auth Module
│   └── (page scripts)      # Specific page logic
└── assets/                 # Images and icons
```

## 🚀 Getting Started

1. Clone the repository:
   `git clone https://github.com/yourusername/insurance-corner.git`
2. Navigate to the project directory:
   `cd insurance-corner`
3. Open `index.html` in your preferred web browser. No local server required!

## 🛣️ Roadmap
- [ ] Integrate AWS Cognito for robust Multi-Factor Authentication (MFA).
- [ ] Add a user dashboard for policy management.
- [ ] Implement a payment gateway mockup.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
