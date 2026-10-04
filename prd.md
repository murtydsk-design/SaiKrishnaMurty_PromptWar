# ThinkLens — Product Requirements Document

## 1. Product Overview

### Product Name
ThinkLens

### Tagline
See what your thinking might be missing.

### Product Type
AI-powered critical-thinking assistant.

### Core Idea

ThinkLens helps users identify potential blind spots in their reasoning when considering a decision.

The system does not make decisions for users.

Instead, it acts as a thinking partner that helps users:

- Examine their assumptions
- Identify overlooked factors
- Detect conflicts in their reasoning
- Consider possible cognitive biases
- Explore important questions
- Think about short-term and long-term implications

---

# 2. Problem

People often make decisions based on the information that is most visible to them.

During this process, they may:

- Overlook important factors
- Rely on unstated assumptions
- Focus too heavily on one benefit
- Ignore risks
- Fail to recognize conflicts in their own reasoning
- Focus on short-term benefits while ignoring long-term consequences

ThinkLens exists to help users notice these blind spots.

---

# 3. Target Users

ThinkLens can be used by anyone making a meaningful decision.

Examples:

- Students choosing internships
- Students choosing colleges or courses
- Professionals considering job offers
- People evaluating purchases
- People considering career changes
- Entrepreneurs evaluating business ideas
- People making personal or financial decisions

The system should remain general-purpose.

---

# 4. Core Product Principle

## ThinkLens is a thinking partner, not a decision maker.

The AI must never:

- Tell the user what decision to make
- Recommend an option
- Say "you should accept"
- Say "you should reject"
- Declare an option as the best choice
- Give a final verdict
- Make the decision on behalf of the user

The AI should instead:

- Surface assumptions
- Identify missing information
- Highlight overlooked factors
- Point out reasoning conflicts
- Identify possible biases
- Ask reflective questions

The final decision always belongs to the user.

---

# 5. Main User Flow

ThinkLens has three main steps.

## Step 1 — Describe the Decision

The user provides:

### Decision
Short description of the decision.

Example:

"Should I accept a 6-month internship?"

### Options
Optional list of options.

Example:

"Accept / Decline / Negotiate"

### Relevant Details
Long-form information about the situation.

Example:

- Stipend
- Location
- Working hours
- Role
- Learning opportunities
- College schedule

### Why I'm Leaning This Way
The user's current reasoning.

Example:

"I'm mainly considering it because the stipend is good, the company is close to home, and it will provide industry experience."

### Load Example

The interface should provide a "Load Example" button.

It should populate the internship example so judges can demonstrate the application quickly.

---

# 6. Step 2 — Clarifying Questions

ThinkLens sends the user's information to the AI.

The AI generates exactly 3 sharp clarifying questions.

The questions should:

- Be specific to the user's situation
- Identify missing information
- Challenge assumptions
- Help expose potential blind spots

Questions must NOT be generic.

Bad:

"What are your goals?"

Better:

"If the internship requires 30 hours per week, how would that interact with your current college workload?"

The user can answer each question.

Answers may be skipped.

---

# 7. Step 3 — Blind Spot Analysis

The AI receives:

- Original decision
- Options
- Relevant details
- User's reasoning
- Clarifying answers

It returns a structured analysis.

The analysis contains:

## 7.1 Reasoning Summary

A neutral 2–3 sentence summary of the user's reasoning.

Purpose:

Make the user feel understood before challenging their reasoning.

---

## 7.2 Hidden Assumptions

Each assumption contains:

- Assumption
- Why it is risky
- Test it by...

The assumptions must be based on the user's actual input.

---

## 7.3 Overlooked Factors

Each factor contains:

- Factor
- Why it matters
- Category

Possible categories:

- Academic
- Financial
- Career
- Health
- Relationships
- Time
- Long-term
- Reversibility

Categories may be extended when appropriate.

---

## 7.4 Internal Conflicts

Identify situations where:

- Two statements conflict
- A stated priority conflicts with another stated fact
- The user's reasoning contains a contradiction

Each conflict should clearly show the two conflicting statements.

---

## 7.5 Questions To Ask Yourself

Generate 5–7 reflective questions.

Questions should be:

- Open-ended
- Specific
- Relevant
- Ordered by importance

---

## 7.6 Bias Check

Identify 1–3 possible cognitive biases.

Examples:

- Anchoring
- Availability bias
- Sunk cost
- Convenience bias
- Confirmation bias

Each bias must include a short explanation connected to the user's input.

Do not diagnose the user.

Use language such as:

"One possible bias to examine is..."

---

## 7.7 Reasoning Balance

Provide a score from 1–10 for:

- Short-term focus
- Long-term focus
- Financial focus
- Growth/learning focus
- Risk awareness

These scores describe the distribution of the user's reasoning.

They do NOT indicate whether the user's decision is good or bad.

---

# 8. Persistent Notice

The application should display:

"This tool does not make decisions for you. It helps you think more clearly."

This should remain visible throughout the main experience.

---

# 9. Example Scenario

Decision:

Should I accept a 6-month internship?

Options:

Accept / Decline / Negotiate

Relevant details:

The internship offers a good stipend, is close to home, has industry exposure, requires working hours, and may overlap with college responsibilities.

Reasoning:

The user is mainly attracted by the stipend, convenience of location, and industry experience.

ThinkLens should help expose:

- Academic impact
- Actual learning
- Mentorship quality
- Long-term career value
- Workload assumptions
- Opportunity cost

ThinkLens must not tell the student whether to accept or reject the internship.

---

# 10. Functional Requirements

The application must:

- Accept decision information
- Accept optional options
- Accept relevant details
- Accept user's reasoning
- Provide a Load Example action
- Generate 3 AI clarifying questions
- Accept clarifying answers
- Generate structured blind-spot analysis
- Display all analysis sections
- Handle API errors
- Show loading states
- Work on mobile
- Maintain the no-decision-maker principle

---

# 11. Non-Functional Requirements

The application should be:

- Fast
- Simple
- Responsive
- Accessible
- Easy to understand
- Reliable during a live demo
- Easy to deploy
- Easy to maintain

Because this is a hackathon, simplicity is more important than enterprise-level architecture.

---

# 12. Future Features

Only add these if sufficient hackathon time remains:

- Reflect Again
- Export analysis
- Copy analysis
- Dark mode
- Session persistence

These are NOT core requirements.

---

# 13. Success Criteria

ThinkLens is successful if a user can:

1. Enter a real decision.
2. Receive useful clarifying questions.
3. Answer or skip the questions.
4. Receive specific blind-spot analysis.
5. Understand what they may have overlooked.
6. Think more critically about the decision.
7. Make their own final decision.

The AI must never make the decision for them.