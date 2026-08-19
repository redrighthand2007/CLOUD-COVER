# Product Requirements Document (PRD)
**Project Name:** CloudCover (formerly Insurance Corner)  
**Version:** 1.0  
**Target Platform:** Web (Desktop & Mobile Responsive)  
**Primary Tech Stack:** HTML/CSS/JS (Frontend) + AWS Serverless (Backend)  

---

## 1. Product Overview
### 1.1 Objective
CloudCover is a modern, next-generation insurance matching platform designed to provide transparent, bias-free premium quotes. Unlike traditional broker sites, CloudCover leverages a client-side algorithm to calculate accurate quotes instantly without spam calls or agent interference. 

### 1.2 Value Proposition
* **Zero Agent Bias:** Pure data-driven quotes.
* **Lightning Fast:** Instant client-side calculations.
* **Cloud-Native Security:** Enterprise-grade authentication via AWS.

---

## 2. User Personas
1. **The Transparent Shopper:** A tech-savvy user (Age 20-40) who wants to find health or auto insurance rates immediately without handing their phone number over to aggressive sales agents.
2. **The Health-Conscious Buyer:** A user who wants to understand how their physical health (BMI) directly impacts their insurance premiums.

---

## 3. Key Features & Functional Requirements

### 3.1 Unified Authentication System
* **Requirement:** A single, secure portal for user registration and login.
* **Fields Required for Registration:** Full Name, Email, 10-digit Mobile Number, valid PAN Card (10-character alphanumeric uppercase), and a strong Password.
* **Security:** Must integrate with **AWS Cognito** to support Multi-Factor Authentication (MFA) via SMS or Email OTP.
* **Flow:** Upon successful registration or login, the user is redirected to the Home page, and the global navigation updates to reflect their authenticated state.

### 3.2 Dynamic Premium Calculator (Products)
* **Requirement:** An interactive form allowing users to input their Age, Insurance Type (Health/Auto), and desired Coverage Amount.
* **Output:** Instantly renders recommended policy cards dynamically via JavaScript based on the user's inputs. 

### 3.3 Interactive BMI Health Tool
* **Requirement:** A dedicated tool for users to input Height and Weight.
* **Output:** Calculates the Body Mass Index (BMI) and visualizes it using a dynamic SVG gauge animation.
* **Context:** Provides immediate feedback on how their health category (Underweight, Normal, Overweight, Obese) affects their potential premium rates.

### 3.4 Secure User Dashboard
* **Requirement:** A private, protected route accessible only to authenticated users.
* **Features:** Displays a personalized greeting, a high-level overview of Active Policies, Pending Claims, and Saved Quotes, alongside a chronological Recent Activity feed.

---

## 4. Non-Functional & UI Requirements

### 4.1 Design System & Aesthetics
* **Theme:** Premium "Dark Mode" aesthetic using Glassmorphism (frosted glass panels with background blur).
* **Colors:** Deep navy base (`#0b111a`) with glowing teal (`#4dbfa8`) and gold (`#f6c343`) accents.
* **Animations:** Micro-interactions on all buttons, smooth scroll-reveal animations (`IntersectionObserver`), and floating ambient background elements.

### 4.2 Architecture & Performance
* **Frontend:** Built with Vanilla JavaScript and pure CSS. No heavy frameworks (React/Angular) to ensure maximum initial load speed.
* **Routing:** Static multi-page architecture with dynamic DOM manipulation for state changes.
* **Graceful Degradation:** The application must utilize `localStorage` to mock backend functionality if the cloud server is unreachable or spun down to save costs.

---

## 5. Technical Architecture (Phase 2: AWS Integration)
As part of the Cloud Architecture curriculum, the static frontend will be integrated with the following AWS services:
1. **AWS S3 & CloudFront:** For globally distributed, secure hosting of the static assets.
2. **AWS Cognito:** For handling User Pools, JWT token management, and MFA.
3. **AWS API Gateway & Lambda:** To handle serverless backend requests (e.g., saving a generated quote).
4. **AWS DynamoDB:** A NoSQL database to persistently store user profiles, saved quotes, and BMI history.

---

## 6. Success Metrics
* 100% Client-side calculation speed (0ms network latency on quotes).
* Flawless Lighthouse scores for Accessibility and SEO (meta tags and responsive design implemented).
* Successful seamless login via AWS Cognito with MFA verification enabled.
