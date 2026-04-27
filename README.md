<div align="center">

<img src="https://raw.githubusercontent.com/kumarwaibhav/sequence-lab-ai-rnn-lstm-gru-visualization/main/public/logo.svg" alt="SequenceLab AI Logo" width="220"/>

# SequenceLab AI

### _RNN · LSTM · GRU — Live Memory Visualization_

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Security Hardened](https://img.shields.io/badge/Security-Hardened-green?style=flat-square&logo=shield)](SECURITY.md)
[![Deploy: Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare_Pages-F38020?style=flat-square&logo=cloudflare)](https://sequence-lab-ai-rnn-lstm-gru-visualization.pages.dev/)

**A futuristic, interactive educational lab for understanding and comparing Recurrent Neural Networks through the lens of email autocomplete — step by step, gate by gate, token by token.**

[🚀 Live Demo](https://sequence-lab-ai-rnn-lstm-gru-visualization.pages.dev/) · [📖 Documentation](#table-of-contents) · [🔒 Security Policy](SECURITY.md) · [🐛 Report a Bug](https://github.com/kumarwaibhav/sequence-lab-ai-rnn-lstm-gru-visualization/issues)

---

</div>

## Table of Contents

- [Overview](#-overview)
- [What Makes This Unique](#-what-makes-this-unique)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Core Modules](#-core-modules)
- [Simulation Engine](#-simulation-engine)
- [Security Architecture](#-security-architecture)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Scenario Library](#-scenario-library)
- [Deploying to Cloudflare Pages](#-deploying-to-cloudflare-pages)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔭 Overview

**SequenceLab AI** is a fully client-side, zero-backend interactive educational application built with Next.js 15 and React 19. It simulates how three foundational sequence models — **RNN**, **LSTM**, and **GRU** — process and remember context while predicting the next word in professional email drafts.

Rather than showing static diagrams or pre-baked results, SequenceLab AI runs a genuine TypeScript simulation engine that computes memory retention, hidden state, gate activations, confidence, and prediction quality in real time — then visualizes every metric live, token by token.

> **No servers. No APIs. No data sent anywhere. 100% in-browser computation.**

---

## ✨ What Makes This Unique

| Feature | Description |
|---|---|
| **Live Token Stepping** | Watch each model process one word at a time, with gate activations updating live |
| **Honest Predictions** | Predictions are hidden until the final token — keeping the lab pedagogically rigorous |
| **12 Curated Scenarios** | Covering long context, negation traps, sentiment flips, and short baselines |
| **Custom Email Input** | Paste any email draft and watch the three models compete to predict your next word |
| **Formal Math** | KaTeX-rendered equations for every model, explained in both classroom and technical language |
| **Security-First Design** | Input validation, CSP headers, HSTS, COOP, and CORP all baked in from day one |
| **Dark / Light Theme** | Full system-aware theming with a toggle |
| **Responsive** | Works on tablet and desktop with adaptive layouts |

---

## 🎯 Features

### Step 1 — Choose a Scenario
Select from 12 hand-crafted email prediction challenges grouped by difficulty:

- **Short context** — baseline scenarios any model handles well
- **Long context** — early clues that must survive many tokens
- **Negation trap** — single words (`not`, `do not`) that flip the correct answer
- **Sentiment shift** — emails that start negative and end constructive

Or write your own email fragment and define the target completion.

### Step 2 — Run the Three-Model Arena
- **Start / Pause / Step / Reset** playback controls
- Adjustable simulation speed (300 ms → 1600 ms per token)
- Per-model cards showing:
  - Current token being processed
  - Context status label (`Context preserved` / `Partial memory` / `Context fading`)
  - Live memory retention ring
  - Live confidence ring
  - Gate activation bars (LSTM: input / forget / output; GRU: update / reset)
  - Step-by-step plain-English explanation
- Security guardrail banner blocks the run if validation fails

### Step 3 — Compare the Outcome
Unlocked only after the run completes:
- **Memory Over Time** line chart
- **Confidence During the Run** line chart
- **Error / Context Drift** line chart
- **Capability Radar** (memory, confidence, quality, stability, efficiency)
- **Cost vs Capability** bar chart (quality, efficiency, complexity)
- Top-3 word predictions per model with confidence scores and reasoning

### Step 4 — Theory, Math & Architecture
- Full architecture diagrams (RNN / LSTM / GRU) with node-by-node explanations
- KaTeX-rendered formal equations for every gate and state
- Strengths, weaknesses, and real-world use cases per model

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SSR-ready static-first rendering |
| **UI Library** | React 19 | Concurrent rendering, hooks |
| **Language** | TypeScript 5.7 | Full type safety throughout |
| **Styling** | Tailwind CSS 3.4 | Utility-first design system |
| **Animation** | Framer Motion 11 | Smooth UI transitions |
| **Charts** | Recharts 2.15 | Line, Bar, Radar charts |
| **Math** | KaTeX + react-katex | LaTeX equation rendering |
| **Icons** | Lucide React | Consistent icon set |
| **State** | Zustand 5 | Lightweight global state |
| **Validation** | Zod 3.24 | Runtime schema validation |
| **UI Primitives** | Radix UI | Accessible headless components |
| **Fonts** | Google Fonts (Playfair Display, Source Sans 3) | Editorial typography |

---

## 📁 Project Structure

```
sequencelab-ai/
├── app/
│   ├── globals.css              # Design tokens, Tailwind base, custom animations
│   ├── layout.tsx               # Root layout, metadata, font loading
│   └── page.tsx                 # Entry point → SequenceLabApp
│
├── components/
│   └── ui/
│       └── button.tsx           # Radix-based Button component with CVA variants
│
├── features/
│   └── sequence-lab/
│       └── components/
│           ├── sequence-lab-app.tsx     # 🏛 Main orchestrator — all state & layout
│           ├── model-card.tsx           # Per-model card: gates, rings, predictions
│           ├── metric-ring.tsx          # Conic-gradient circular metric indicator
│           ├── comparison-chart.tsx     # Recharts comparison suite (5 charts)
│           └── architecture-diagram.tsx # Node-flow architecture + term glossary
│
├── lib/
│   ├── content/
│   │   └── algorithms.ts        # Algorithm metadata, equations, strengths, use-cases
│   ├── models/
│   │   └── types.ts             # TypeScript types: ModelKind, ModelStep, ModelResult, Scenario
│   ├── security/
│   │   └── input-validation.ts  # Email fragment & target phrase validation + sanitization
│   ├── simulation/
│   │   ├── presets.ts           # 12 curated Scenario definitions
│   │   └── runner.ts            # 🧪 Core simulation engine (RNN / LSTM / GRU)
│   └── utils.ts                 # cn() — clsx + tailwind-merge
│
├── types/
│   └── react-katex.d.ts         # Type declarations for react-katex
│
├── next.config.ts               # Security headers, CSP, HSTS, COOP, CORP
├── tailwind.config.ts           # Theme, fonts, custom utilities
├── tsconfig.json                # Strict TypeScript config with path aliases
├── package.json
├── SECURITY.md                  # Full security hardening checklist
└── README.md
```

---

## 🧩 Core Modules

### `lib/simulation/runner.ts` — The Simulation Engine

The heart of SequenceLab AI. Implements simplified but mathematically faithful models of all three architectures:

**RNN** uses `tanh` activation with a single decaying hidden state. Memory fades proportionally with distance from the relevant token.

**LSTM** implements the full four-gate architecture: input gate (`σ`), forget gate (`σ`), cell candidate (`tanh`), and output gate (`σ`). The cell state acts as a protected memory highway that resists overwriting.

**GRU** uses two gates — update (`z_t`) and reset (`r_t`) — to blend old memory with new evidence. Fewer parameters than LSTM with competitive long-range performance.

All three models run on the same token sequence and scenario, producing:
- Per-step `hidden`, `memory`, `confidence`, `retention`, `error`, `latency`
- Gate activation values (LSTM/GRU only)
- Step-level plain-English explanations
- Final top-3 word predictions with confidence-ranked reasoning

### `lib/security/input-validation.ts` — Input Guard

A dual-function validation module protecting the simulation from unsafe input:

- `validateEmailFragment(value)` — validates custom email drafts (max 420 chars, 5+ readable words, no scripts/SQL/symbols flood)
- `validateTargetPhrase(value)` — validates target completions (max 80 chars, max 6 words, letters/numbers/apostrophes/hyphens only)
- `sanitizeText(value)` — strips control characters and normalizes whitespace

Patterns blocked: `<script>`, XSS event handlers, inline iframes, SQL injection keywords, shell metacharacters, repeated character floods, extremely long tokens.

### `lib/simulation/presets.ts` — Scenario Library

12 pre-authored `Scenario` objects each defining:
- `id`, `name`, `difficulty` label
- `input` — the email fragment
- `target` — the expected next word/phrase
- `clueTokens` — words the simulation engine weights as contextually important
- `description` — classroom-ready explanation of why the scenario is challenging

---

## 🔒 Security Architecture

SequenceLab AI ships with a comprehensive, layered defense posture documented in [`SECURITY.md`](SECURITY.md).

### Implemented In-Code

| Control | Location | Detail |
|---|---|---|
| **Content Security Policy** | `next.config.ts` | `default-src 'self'`, blocks all third-party scripts/frames |
| **HSTS** | `next.config.ts` | `max-age=63072000; includeSubDomains; preload` |
| **X-Frame-Options** | `next.config.ts` | `DENY` — blocks all iframe embedding |
| **X-Content-Type-Options** | `next.config.ts` | `nosniff` |
| **Referrer-Policy** | `next.config.ts` | `strict-origin-when-cross-origin` |
| **Permissions-Policy** | `next.config.ts` | Camera, mic, geo, payment, USB, Bluetooth all denied |
| **COOP** | `next.config.ts` | `same-origin` |
| **CORP** | `next.config.ts` | `same-origin` |
| **No X-Powered-By** | `next.config.ts` | Framework fingerprint removed |
| **Input Validation** | `lib/security/input-validation.ts` | XSS, SQLi, shell injection, symbol floods |
| **React Output Escaping** | All JSX | No `dangerouslySetInnerHTML` anywhere |
| **Simulation Gate** | `sequence-lab-app.tsx` | `canRunSimulation` blocks the run if validation fails |

### Recommended for Production (from SECURITY.md)

- Cloudflare WAF with OWASP managed rules + bot protection
- DDoS protection at the edge
- TLS 1.3 preferred, TLS 1.2 minimum
- HSTS preload after confirming full-subdomain HTTPS
- Dependency audit in CI (`npm audit` / Dependabot / Snyk)
- SAST: CodeQL or Semgrep
- Real-time error monitoring: Sentry or equivalent

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or later
- npm 10 or later (or pnpm / yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/kumarwaibhav/sequence-lab-ai-rnn-lstm-gru-visualization.git
cd sequence-lab-ai-rnn-lstm-gru-visualization

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **No environment variables are required.** This is a fully static, zero-backend application. There is no `.env` file to configure.

---

## 📜 Available Scripts

```bash
npm run dev        # Start Next.js development server with hot reload
npm run build      # Production build (outputs to .next/)
npm run start      # Serve the production build locally
npm run lint       # ESLint check across all source files
npm run typecheck  # TypeScript type check without emitting files
```

---

## 📚 Scenario Library

| ID | Name | Difficulty | Challenge |
|---|---|---|---|
| `meeting-followup` | Long Clue: Meeting Follow-up | Long context | Compliance appendix clue buried early |
| `apology-recovery` | Sentiment Flip: Customer Reply | Sentiment shift | Negative → positive context update |
| `negation-trap` | Hard Negation: Archive Trap | Negation trap | `do not archive` changes the correct answer |
| `short-confirmation` | Easy Baseline: Short Confirmation | Short context | All models handle this well |
| `deadline-extension` | Delayed Dependency: Extension | Long context | Deadline pressure spans many tokens |
| `invoice-reminder` | Business Context: Invoice | Short context | Invoice + end-of-month context |
| `policy-exception` | Policy Rule: Approval Hold | Negation trap | Constraint word must not be ignored |
| `interview-scheduling` | Schedule Memory: Interview | Long context | Wednesday → Thursday scheduling chain |
| `support-resolution` | Recovery Signal: Support Update | Sentiment shift | Problem → resolution arc |
| `legal-redline` | Legal Context: Redline Memory | Long context | `indemnity clause` must survive pricing edits |
| `medical-referral` | Clinical Referral Email | Long context | Cardiology referral buried under details |
| `security-warning` | Security Warning: Do Not Share | Negation trap | Safety-critical negation must be preserved |

---

## ☁️ Deploying to Cloudflare Pages

SequenceLab AI deploys perfectly on **Cloudflare Pages** with Next.js support via `@cloudflare/next-on-pages`.

### 1. Add the Cloudflare adapter

```bash
npm install --save-dev @cloudflare/next-on-pages
```

### 2. Add a `wrangler.jsonc` (or `wrangler.toml`) at the project root

```jsonc
{
  "name": "sequence-lab-ai",
  "compatibility_date": "2024-09-23",
  "compatibility_flags": ["nodejs_compat"],
  "pages_build_output_dir": ".vercel/output/static"
}
```

### 3. Update `next.config.ts`

Add the edge runtime export directive:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Add this for Cloudflare Pages edge runtime
  experimental: {
    runtime: "edge",
  },
  // ... existing headers config
};

export default nextConfig;
```

### 4. Add build script for Cloudflare

In `package.json`:

```json
{
  "scripts": {
    "pages:build": "npx @cloudflare/next-on-pages",
    "preview": "npx wrangler pages dev"
  }
}
```

### 5. Deploy via Cloudflare Dashboard (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create**
2. Select **Pages** → **Connect to Git**
3. Authorize GitHub and select `sequence-lab-ai-rnn-lstm-gru-visualization`
4. Configure the build settings:

| Setting | Value |
|---|---|
| **Framework preset** | Next.js |
| **Build command** | `npx @cloudflare/next-on-pages` |
| **Build output directory** | `.vercel/output/static` |
| **Node.js version** | `20` |

5. Click **Save and Deploy**

### 6. Deploy via CLI (Alternative)

```bash
# Build for Cloudflare Pages
npx @cloudflare/next-on-pages

# Deploy (first time — creates new project)
npx wrangler pages deploy .vercel/output/static --project-name sequence-lab-ai

# Deploy (subsequent updates)
npx wrangler pages deploy .vercel/output/static --project-name sequence-lab-ai
```

### 7. Custom Domain (Optional)

In the Cloudflare Pages project → **Custom domains** → **Set up a custom domain** → enter your domain → Cloudflare auto-provisions TLS.

### Security Headers on Cloudflare

All security headers (`CSP`, `HSTS`, `X-Frame-Options`, etc.) are already set in `next.config.ts` and will be served by the edge automatically. For additional WAF protection:

1. In Cloudflare Dashboard → **Security** → **WAF** → Enable **OWASP Core Rule Set**
2. Enable **Bot Fight Mode** under **Security** → **Bots**
3. Enable **DDoS Protection** (on by default for all plans)
4. Under **SSL/TLS** → set to **Full (strict)** mode

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes with clear, focused commits
4. Run checks: `npm run typecheck && npm run lint && npm run build`
5. Open a Pull Request with a clear description of what you changed and why

Please keep new code consistent with the existing TypeScript strict mode, security-first patterns, and component structure.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with precision by **Waibhav Kumar** · [GitHub](https://github.com/kumarwaibhav) · [Email](mailto:kwa.waibhav@gmail.com)

_SequenceLab AI — because understanding sequence models should feel like a lab, not a lecture._

</div>
