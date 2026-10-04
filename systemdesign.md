# ThinkLens — System Design

## 1. System Objective

ThinkLens is a lightweight AI-powered web application that analyzes user reasoning around a decision.

The system is designed as a thinking assistant rather than a recommendation engine.

---

# 2. Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Next.js App Router

## Backend

Next.js server-side API routes.

The application will use server-side API routes to communicate with Gemini.

## AI

Google Gemini API.

The Gemini API key must remain server-side.

## Storage

No database.

Application state is maintained using React state.

Optional sessionStorage may be used later if required.

## Deployment

Vercel.

## Repository

GitHub.

---

# 3. High-Level System Flow

```text
                    USER
                     |
                     v
              Next.js Frontend
                     |
          +----------+----------+
          |                     |
          v                     v
   /api/clarify            /api/analyze
          |                     |
          +----------+----------+
                     |
                     v
                Gemini API
                     |
                     v
             Structured JSON
                     |
                     v
              Next.js Frontend
                     |
                     v
             Analysis Results