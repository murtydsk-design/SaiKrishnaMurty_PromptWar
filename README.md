# ThinkLens 👁️💡

> **"See what your thinking might be missing."**

An AI-powered critical-thinking assistant that helps users examine hidden assumptions, overlooked factors, internal reasoning conflicts, and cognitive biases before making a decision.

---

## 🎯 Core Product Principle

> **ThinkLens is a thinking partner, NOT a decision maker.**

The AI must NEVER:
- Recommend an option or tell the user what to do.
- Say "accept" or "reject".
- Declare an option as the "best" choice or give a final verdict.

Instead, ThinkLens acts as a **Socratic coach** to surface missing information, challenge unstated assumptions, and encourage deeper reflection. **The final decision always belongs to the user.**

---

## ✨ Key Features

- 🧠 **Socratic Clarifying Questions**: Generates 3 sharp, contextual questions tailored specifically to the user's decision context to uncover reasoning gaps.
- 🔍 **Hidden Assumptions Exposer**: Identifies unstated beliefs the user may be relying on, why relying on them could be risky, and how to test them.
- 📐 **Overlooked Factors Detector**: Highlights critical dimensions (Academic, Financial, Career, Health, Time, Reversibility, etc.) missing from the reasoning.
- ⚡ **Internal Conflict Detection**: Spotlights contradictions or tensions between stated priorities and facts.
- 🛡️ **Cognitive Bias Check**: Identifies potential cognitive biases (e.g., Anchoring, Availability bias, Sunk-cost thinking) using non-judgmental, cautious language.
- 📊 **Reasoning Balance Scorecard**: Provides a 1–10 distribution score across short-term, long-term, financial, growth/learning focus, and risk awareness.
- 🔒 **Zero-Persistence & Privacy**: Operates statelessly using React state with server-side Gemini key protection.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, React 19) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (Vanilla CSS tokens, sleek dark mode) |
| **AI Engine** | [Google Gemini API](https://ai.google.dev/) (`@google/generative-ai` SDK) |
| **Architecture** | Full-Stack Serverless Next.js API Routes (No External Database) |

---

## 🏗️ High-Level Architecture

```text
                     ┌───────────────────────┐
                     │     User Interface    │
                     │  (Next.js App Router) │
                     └───────────┬───────────┘
                                 │
                   HTTP POST     │     HTTP POST
             ┌───────────────────┴───────────────────┐
             │                                       │
             v                                       v
   ┌───────────────────┐                   ┌───────────────────┐
   │   /api/clarify    │                   │   /api/analyze    │
   └─────────┬─────────┘                   └─────────┬─────────┘
             │                                       │
             └───────────────────┬───────────────────┘
                                 │
                                 v
                     ┌───────────────────────┐
                     │   lib/llm.ts (Server) │
                     │  (Gemini 1.5/Flash)   │
                     └───────────┬───────────┘
                                 │
                                 v
                     ┌───────────────────────┐
                     │   Structured JSON     │
                     │   Response & Retry    │
                     └───────────────────────┘
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Gemini API Key**: Obtain a free key from [Google AI Studio](https://aistudio.google.com/)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/murtydsk-design/SaiKrishnaMurty_PromptWar.git
cd SaiKrishnaMurty_PromptWar
npm install
```

### 3. Environment Variable Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Google Gemini API key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

> ⚠️ **Security Note**: `GEMINI_API_KEY` is loaded strictly server-side and is protected from client-side bundle exposure or Git tracking via `.gitignore`.

### 4. Running Local Development Server

Start the Next.js dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 API Endpoints

### `GET /api/health`
Health check endpoint returning system status.

```json
{
  "status": "ok",
  "project": "ThinkLens"
}
```

### `POST /api/clarify`
Generates 3 contextual clarifying questions.

**Request Body:**
```json
{
  "decision": "Should I accept a 6-month internship?",
  "options": "Accept / Decline / Negotiate",
  "details": "Good stipend, close to home, potential overlap with college schedule.",
  "reasoning": "I am mainly considering it for the stipend and convenience."
}
```

**Response:**
```json
{
  "questions": [
    "What specific options exist with your college or the employer to resolve schedule overlaps?",
    "What additional information about daily mentorship would help evaluate this role?",
    "If mentorship is minimal, how does that change the value of the stipend for you?"
  ]
}
```

### `POST /api/analyze`
Generates the complete 7-part structured blind-spot analysis.

---

## 📜 Project Reference & Governance

The design, system principles, and development constraints are governed by:
- [`prd.md`](file:///Users/saikrishnamurty/Downloads/BlindSpot/prd.md) — Product Requirements Document
- [`systemdesign.md`](file:///Users/saikrishnamurty/Downloads/BlindSpot/systemdesign.md) — High-Level System Architecture
- [`rules.md`](file:///Users/saikrishnamurty/Downloads/BlindSpot/rules.md) — Mandatory Development Rules
- [`architecture.md`](file:///Users/saikrishnamurty/Downloads/BlindSpot/architecture.md) — Technical Architecture Style

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
