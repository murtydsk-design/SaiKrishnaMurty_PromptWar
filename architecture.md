# ThinkLens — Architecture

## 1. Architecture Style

ThinkLens uses a simple full-stack Next.js architecture.

The frontend and backend API routes exist within the same Next.js application.

There is no separate Express server.

There is no database.

---

# 2. High-Level Architecture

```text
+---------------------------+
|          USER             |
+-------------+-------------+
              |
              v
+---------------------------+
|     Next.js Frontend      |
|                           |
| React + TypeScript        |
| Tailwind CSS              |
+-------------+-------------+
              |
              |
       HTTP API Calls
              |
       +------+------+
       |             |
       v             v
+-------------+ +-------------+
| /api/       | | /api/       |
| clarify     | | analyze     |
+------+------+ +------+------+
       |               |
       +-------+-------+
               |
               v
       +---------------+
       | Gemini API    |
       |               |
       | LLM           |
       +-------+-------+
               |
               v
       Structured JSON
               |
               v
       Next.js API Route
               |
               v
       React Frontend
               |
               v
       Analysis UI