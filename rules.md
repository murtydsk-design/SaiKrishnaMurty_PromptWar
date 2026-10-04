# ThinkLens — Development Rules

These rules are mandatory for every development stage.

Before making ANY code change, read:

1. prd.md
2. systemdesign.md
3. database.md
4. rules.md
5. architecture.md

Treat these files as the project's source of truth.

Do not contradict these files unless the project owner explicitly changes a requirement.

---

# 1. DEVELOPMENT PROCESS

The project is being built stage-by-stage.

Never implement future stages without explicit permission.

When the user asks for a specific stage:

- Work only on that stage.
- Do not add future features.
- Do not redesign unrelated parts.
- Do not introduce unnecessary dependencies.

After completing the requested stage:

STOP.

Wait for the user to request the next stage.

---

# 2. HACKATHON PRIORITY

Total target build time:

Approximately 2.5 hours.

Priority order:

1. Working application
2. Meaningful AI functionality
3. Reliable user flow
4. Deployment
5. UI polish
6. Optional features

Do not sacrifice working functionality for unnecessary architecture.

---

# 3. SIMPLICITY RULE

Always choose the simplest implementation that satisfies the requirement.

Avoid:

- Over-engineering
- Unnecessary abstractions
- Unnecessary libraries
- Complex state management
- Unnecessary API layers
- Unnecessary configuration

---

# 4. TECHNOLOGY RULE

Use only the agreed stack:

- Next.js
- App Router
- TypeScript
- Tailwind CSS
- React
- Gemini API
- Next.js server-side API routes

Do not change the stack without explicit approval.

---

# 5. DATABASE RULE

ThinkLens has NO DATABASE.

Never add:

- PostgreSQL
- MongoDB
- Supabase
- Firebase
- Neon
- Prisma
- Drizzle
- Mongoose
- Any ORM

unless explicitly instructed by the project owner.

Use React state.

Optional sessionStorage may be used only if explicitly required.

---

# 6. API KEY SECURITY

The Gemini API key is a server-side secret.

Never:

- Hardcode the key
- Put it in frontend code
- Put it in React components
- Put it in public/
- Put it in HTML
- Use NEXT_PUBLIC_GEMINI_API_KEY
- Commit .env.local
- Include the real key in README

Use:

GEMINI_API_KEY

Server-side only.

---

# 7. AI PRINCIPLE

The AI is a thinking partner.

It is NOT a decision maker.

The AI must never:

- Recommend an option
- Give a verdict
- Choose an option
- Tell the user what they should do
- Say accept/reject
- Claim certainty about outcomes

The AI should:

- Ask questions
- Surface assumptions
- Identify missing information
- Highlight overlooked factors
- Identify possible conflicts
- Identify possible biases
- Encourage reflection

---

# 8. AI SPECIFICITY RULE

AI output must be grounded in the user's actual input.

Do not produce generic advice.

Every meaningful observation should reference something from the user's:

- Decision
- Options
- Details
- Reasoning
- Clarifying answers

If information is missing:

Say that information is missing.

Never invent facts.

---

# 9. AI TONE

The AI must be:

- Supportive
- Curious
- Neutral
- Non-judgmental
- Specific
- Clear

Avoid:

- Condescending language
- Fear-based language
- Overconfident predictions
- Moral judgments

---

# 10. JSON RULE

Where structured AI output is required:

The model must return strict JSON.

The server must parse and validate the JSON.

Do not rely on the frontend to interpret arbitrary AI text.

---

# 11. AI ERROR HANDLING

For AI JSON:

1. Attempt JSON.parse().
2. Remove markdown fences if present.
3. Attempt parsing again.
4. Retry the model once.
5. Return a friendly error if parsing still fails.

Never expose raw model errors to users.

---

# 12. INPUT VALIDATION

Validate inputs on the server.

Do not trust client-side validation alone.

Handle:

- Missing fields
- Empty fields
- Excessively large input
- Invalid request bodies
- Unexpected data types

---

# 13. USER EXPERIENCE

The application should always communicate what is happening.

For AI calls:

Show:

- Loading state
- Success state
- Error state

Buttons should be disabled while requests are processing when appropriate.

---

# 14. UI RULES

Use Tailwind CSS.

Keep the design:

- Clean
- Modern
- Professional
- Responsive
- Mobile-friendly

Do not introduce a UI library unless explicitly approved.

---

# 15. ACCESSIBILITY

Use:

- Proper labels
- Semantic HTML
- Keyboard-friendly controls
- Readable text
- Clear error messages
- Sufficient contrast

Accessibility does not need to be perfect, but obvious accessibility issues should be avoided.

---

# 16. FILE RULE

When creating or modifying files:

Provide complete files.

Never use:

"...rest of code"

Never leave important sections incomplete.

---

# 17. CHANGE RULE

Before changing a file:

Understand its current purpose.

Do not overwrite working functionality unnecessarily.

Make the smallest change required.

---

# 18. ERROR RULE

If an error occurs:

1. Read the actual error.
2. Identify the root cause.
3. Make the smallest fix.
4. Test again.

Do not randomly change multiple files.

Do not install packages just because an error appears.

---

# 19. DEPLOYMENT RULE

Deployment is important, but deployment work should happen after the core application is functional.

Target:

Vercel.

Do not introduce deployment-specific complexity unless required.

---

# 20. GITHUB RULE

Do not commit secrets.

Before pushing:

Check:

git status

Confirm:

.env.local

is not tracked.

---

# 21. FEATURE PRIORITY

Core features come first.

Core:

- Decision input
- Clarifying questions
- Blind-spot analysis
- Analysis results
- AI safety principle
- Error handling

Optional:

- Reflect Again
- Export
- Copy
- Dark mode
- Session persistence

Optional features must never delay core functionality.

---

# 22. NO UNREQUESTED FEATURES

Do not add features simply because they seem useful.

If a feature is not in the PRD or current stage:

Do not build it.

---

# 23. FINAL PRINCIPLE

The project should always optimize for:

"Simple, reliable, meaningful AI."

Not:

"Complex architecture."

Every implementation decision should support the hackathon goal.