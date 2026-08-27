<div align="center">
  <img src="logo.png" alt="CloudCover Logo" width="300" />
  <h1>CloudCover ?" Next-Gen Insurance Platform</h1>
  <p><strong>A lightning-fast, zero-dependency Single Page Application powered by a serverless AWS backend.</strong></p>

[![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![AWS](https://img.shields.io/badge/AWS-Serverless-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## dY  The Philosophy

Most insurance websites are bloated, slow, and riddled with agent bias. **CloudCover strips it all away.**

This project proves that a **production-quality, highly secure, full-stack application** can be built using the web's native trio (HTML/CSS/JS) layered perfectly onto a modern **Serverless Cloud Architecture**. No React, no heavy node_modules, just pure performance.

## dY>,? Tech Stack: What & Why

### Frontend Architecture: Pure Vanilla JS SPA
* **What we used:** Native ES6 JavaScript, HTML5, CSS3, and a custom-built Hash Router.
* **Why we used it:** To achieve sub-1s navigation, absolute minimal bundle size, and total control over the DOM without framework overhead.
* **Omitted Alternatives:** React, Vue, Angular. These were rejected because they introduce heavy build chains (Webpack/Vite), virtual DOM overhead, and massive dependency trees (
ode_modules) which are completely unnecessary for a streamlined, responsive portal.

### Authentication & Identity: AWS Cognito
* **What we used:** Amazon Cognito User Pools with Custom Hosted UI (Dark Theme) and Enforced MFA.
* **Why we used it:** Offloading authentication to AWS guarantees enterprise-grade security (JWT validation, brute-force protection) out of the box. MFA was a strict requirement for user data safety.
* **Omitted Alternatives:** Firebase Auth, Auth0, Custom JWT Node.js Server. Firebase/Auth0 lock you into their ecosystem and pricing, while a custom Node.js auth server introduces severe security liabilities and database maintenance overhead.

### Serverless Backend: AWS API Gateway & Lambda
* **What we used:** Amazon HTTP API Gateway acting as a front door, triggering a Node.js AWS Lambda function (CloudCover_SaveData).
* **Why we used it:** Serverless functions scale infinitely from zero, meaning you only pay for exact compute time. The HTTP API Gateway acts as a secure proxy that natively integrates a JWT Authorizer to block unauthenticated requests before they even reach our code.
* **Omitted Alternatives:** Express.js/EC2, Heroku, Docker Containers. Provisioning virtual machines (EC2) requires OS patching, load balancing, and 24/7 uptime costs. Serverless eliminates Dev-Ops overhead entirely.

### Database: Amazon DynamoDB
* **What we used:** Amazon DynamoDB (NoSQL).
* **Why we used it:** Single-digit millisecond latency at any scale. It integrates flawlessly with Lambda via the AWS SDK.
* **Omitted Alternatives:** MongoDB, PostgreSQL/MySQL (RDS). A relational database (RDS) is overkill for flexible, unstructured policy/quote saving. MongoDB requires managing Atlas clusters, whereas DynamoDB is completely serverless and native to AWS.

---

## o" Feature Highlights

| Feature | Description |
|:--------|:------------|
| s **Custom SPA Router** | Hand-built hash router (#home, #quotes, #bmi) ?" zero page reloads, instant navigation. |
| dY"? **Cognito Identity** | JWT-based auth via Amazon Cognito Hosted UI with strict MFA enforcement. |
| dY-,? **Serverless Sync** | Dashboard saves data securely to DynamoDB via an API Gateway JWT Authorizer. |
| dYZ" **Pure CSS Transitions** | Silky fade-in animations triggered by CSS class toggling during route changes. |
| dY r **Instant Quote Engine** | Real-time policy filtering & premium calculations based on age, coverage, and insurance type. |
| s-,? **BMI Health Gauge** | Interactive SVG circular gauge with animated color-coded health categories. |
| dYOT **Glassmorphism Dark UI** | Premium frosted-glass aesthetic with responsive layouts across all devices. |

---

## dY"- Complete Project Journey (From Scratch to Production)

**Phase 1: Zero-Dependency Foundation**
Started by tearing down a clunky multi-page site and restructuring it into a strict Single Page Application (SPA). A custom Vanilla JS router was built from scratch to dynamically inject 8 distinct modular views (Home, Quotes, BMI, Dashboard, etc.) into a single index.html shell. 

**Phase 2: UI & UX Overhaul**
Engineered a unified Glassmorphism dark-mode system. Fixed cross-browser flexbox scaling bugs, introduced dynamic SVG animations for health tracking, and created responsive multi-column layouts (75-25 splits) entirely with CSS Grid/Flexbox.

**Phase 3: Secure Authentication (AWS Cognito)**
Configured an Amazon Cognito User Pool with strict Multi-Factor Authentication. The classic Hosted UI was heavily customized with injected CSS and a generated CloudCover logo to perfectly match the site's dark theme. The frontend was wired to intercept the redirect, parse the JWT id_token, and instantly securely log the user in client-side.

**Phase 4: Serverless API Pipeline**
Deployed a DynamoDB table (CloudCover_Users) to store client policies. Built an AWS Lambda function in Node.js 20 to handle secure data injection, and exposed it via an AWS HTTP API Gateway. Protected the API endpoint using a Cognito JWT Authorizer to ensure only valid, logged-in users could sync their dashboards.

**Phase 5: Production Deployment**
Codebase cleaned, git history optimized, and statically deployed to GitHub Pages (HTTPS enforced). 

---

## dY", Project Structure

`	ext
CloudCover-Website/
"o"?"? dY", index.html                 +? Master SPA Shell
"o"?"? dY"o logo.png                   +? Custom UI branding
"o"?"? dYZ" cognito-theme.css          +? Auth UI injected styling
"o"?"? dYZ" css/
",   """?"? style.css                 +? Global styling & glassmorphism
"o"?"? sT,? js/
",   "o"?"? router.js                 +? Custom Vanilla JS Hash Router
",   "o"?"? auth.js                   +? AWS Cognito JWT parser & session manager
",   "o"?"? main.js                   +? Global layout utilities
",   """?"? view-*.js                 +? 8 distinct modular UI views (Dashboard, Quotes, etc.)
"""?"? dY"o README.md                  +? Project documentation
`

---

## dYs? Getting Started

**Prerequisites:** A web browser. That's it.

`ash
# 1. Clone the repository
git clone https://github.com/redrighthand2007/CloudCover-Website.git

# 2. Enter the project
cd CloudCover-Website

# 3. Launch it
# Just open index.html in your browser ?" no server, no build step, no node_modules!
`

---

<div align="center">

**Built from scratch with clean code and serverless scale.**

</div>
