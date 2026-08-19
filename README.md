<div align="center">

# ☁️ CloudCover

### *Instant Quotes. Zero Agent Bias.*

A blazing-fast **Single Page Application** for modern insurance quoting — built with zero frameworks, pure Vanilla JavaScript, and love.

&nbsp;

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Glossary/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[![Stars](https://img.shields.io/github/stars/redrighthand2007/CloudCover-Website?style=social)](https://github.com/redrighthand2007/CloudCover-Website)
[![Forks](https://img.shields.io/github/forks/redrighthand2007/CloudCover-Website?style=social)](https://github.com/redrighthand2007/CloudCover-Website/fork)

</div>

---

## 🧠 The Philosophy

> Most insurance websites are bloated, slow, and riddled with agent bias.
> **CloudCover strips it all away.**
>
> No React. No Angular. No npm install. Just open `index.html` and go.

This project proves that a **stunning, production-quality SPA** can be built with nothing but the web's native trio — HTML, CSS, and JavaScript. Every page transition, every form validation, every route change is hand-crafted.

---

## ✨ Feature Highlights

| Feature | Description |
|:--------|:------------|
| ⚡ **Custom SPA Router** | Hand-built hash router (`#home`, `#quotes`, `#bmi`) — zero page reloads, instant navigation |
| 🎨 **Pure CSS Transitions** | Silky fade-in animations triggered by CSS class toggling during route changes |
| 🧮 **Instant Quote Engine** | Real-time policy filtering & premium calculations based on age, coverage, and insurance type |
| ⚖️ **BMI Health Gauge** | Interactive SVG circular gauge with animated color-coded health categories |
| 🔐 **Auth-Ready Architecture** | Modular authentication scaffold — plug in AWS Cognito and MFA when ready |
| 🌙 **Glassmorphism Dark UI** | Premium frosted-glass aesthetic with responsive layouts across all devices |
| 📝 **Smart Form Validation** | Regex-powered client-side validation for PAN, phone, email, and password strength |
| 🎯 **Custom 404 Page** | Branded "Out of Coverage Area" page for unknown routes |

---

## 🏗️ Architecture

CloudCover follows a **strict SPA pattern** — one HTML file serves as the shell, and JavaScript views dynamically render content based on the URL hash.

```
┌─────────────────────────────────────────────────────────┐
│                      index.html                         │
│                    (Master Shell)                        │
│                                                         │
│   ┌──────────┐   ┌──────────┐   ┌──────────────────┐   │
│   │  <nav>   │   │  <main>  │   │     <footer>     │   │
│   │  Static  │   │  #app    │   │     Static       │   │
│   │          │   │ (Dynamic)│   │                   │   │
│   └──────────┘   └────┬─────┘   └──────────────────┘   │
│                       │                                  │
└───────────────────────┼──────────────────────────────────┘
                        │
              ┌─────────┴─────────┐
              │    router.js      │
              │  (Hash Listener)  │
              └─────────┬─────────┘
                        │
        ┌───────┬───────┼───────┬───────┬────────┐
        ▼       ▼       ▼       ▼       ▼        ▼
    view-     view-   view-   view-   view-    view-
    home.js  quotes  bmi.js  auth.js  dash..  contact
```

---

## 📂 Project Structure

```
CloudCover-Website/
│
├── 📄 index.html                 ← Master SPA Shell (the only HTML file!)
│
├── 🎨 css/
│   └── style.css                 ← Consolidated styles + animations + glassmorphism
│
├── ⚙️ js/
│   ├── router.js                 ← Custom Vanilla JS Hash Router
│   ├── main.js                   ← Global utilities (scroll observer, auth UI)
│   ├── auth.js                   ← AWS Cognito authentication scaffold
│   │
│   ├── view-home.js              ← 🏠 Landing page view
│   ├── view-quotes.js            ← 📊 Quote calculator view
│   ├── view-bmi.js               ← ⚖️ BMI tool view
│   ├── view-auth.js              ← 🔑 Login / signup view
│   ├── view-registration.js      ← 📝 Onboarding form view
│   ├── view-dashboard.js         ← 📋 Client dashboard view
│   ├── view-contact.js           ← 📞 Contact us view
│   └── view-notfound.js          ← 🚫 Custom 404 view
│
├── 📚 docs/
│   └── prd.md                    ← Product Requirements Document
│
└── 📜 LICENSE                    ← MIT License
```

---

## 🚀 Getting Started

**Prerequisites:** A web browser. That's it. Seriously.

```bash
# 1. Clone the repository
git clone https://github.com/redrighthand2007/CloudCover-Website.git

# 2. Enter the project
cd CloudCover-Website

# 3. Launch it
# Just open index.html in your browser — no server, no build step, no node_modules!
```

> 💡 **Pro Tip:** Use VS Code's **Live Server** extension for auto-reload during development.

---

## 🗺️ Roadmap

| Status | Milestone |
|:------:|:----------|
| ✅ | SPA Architecture with custom Vanilla JS router |
| ✅ | Glassmorphism dark-mode UI with CSS transitions |
| ✅ | Quote engine with real-time premium calculation |
| ✅ | BMI calculator with animated SVG gauge |
| ✅ | Client-side form validation (Regex) |
| ✅ | Modular authentication scaffold |
| 🔲 | AWS Cognito integration for MFA |
| 🔲 | Serverless backend (AWS Lambda + DynamoDB) |
| 🔲 | Payment gateway mockup |

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|:-----:|:----------:|
| **Structure** | HTML5 (Semantic) |
| **Styling** | CSS3 (Custom Properties, Glassmorphism, Keyframes) |
| **Logic** | Vanilla JavaScript (ES6+) |
| **Routing** | Custom Hash Router (No library) |
| **Auth (Planned)** | AWS Cognito + MFA |
| **Hosting** | Static — works anywhere |

</div>

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/redrighthand2007/CloudCover-Website/issues).

---

<div align="center">

## 📜 License

This project is licensed under the **MIT License** — see the [`LICENSE`](LICENSE) file for details.

---

**Built with ☕ and clean code.**

*If this project helped you, consider giving it a ⭐!*

</div>
