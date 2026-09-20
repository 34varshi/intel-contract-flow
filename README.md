# ContractWise AI

Build a polished, modern AI-powered web application called:

CONTRACTLENS

"AI Agent for Business Contract Review & Obligation Tracking"

This application is for an Agentic AI Hackathon 2026.

IMPORTANT:

Do NOT include, mention, or create any feature related to LinkedIn, LinkedIn content, LinkedIn engagement, social media posting, or LinkedIn scoring anywhere in the application.

==================================================

1. MAIN PURPOSE

==================================================

ContractLens is an AI agent that helps users understand business contracts.

The user uploads a PDF/DOCX contract, and the AI agent should:

1. Read and understand the contract

2. Extract important information

3. Identify important clauses

4. Detect potential risks

5. Identify obligations and deadlines

6. Track important dates

7. Allow the user to ask questions about the contract

8. Generate a simple contract summary

9. Provide actionable recommendations

10. Show everything in a clean dashboard

The application should feel like an AI AGENT, not just a PDF summarizer.

==================================================

2. AGENTIC AI WORKFLOW

==================================================

Create a clear multi-step agent workflow:

UPLOAD CONTRACT

        ↓

DOCUMENT ANALYSIS AGENT

        ↓

CLAUSE EXTRACTION AGENT

        ↓

RISK ANALYSIS AGENT

        ↓

OBLIGATION & DEADLINE AGENT

        ↓

SUMMARY & RECOMMENDATION AGENT

        ↓

USER CHAT / ACTIONS

Show the progress of the AI agent while analyzing a document.

Example status messages:

✓ Contract uploaded

✓ Document analyzed

✓ Important clauses identified

✓ Obligations extracted

✓ Risks detected

✓ Deadlines identified

✓ Final analysis completed

Use realistic loading/progress animations.

==================================================

3. HOME PAGE

==================================================

Create a professional landing/dashboard page.

Header:

ContractLens

AI Contract Intelligence Agent

Subtitle:

"Understand contracts. Detect risks. Track obligations."

Include a large drag-and-drop upload area.

Text:

"Upload your business contract"

Supported formats:

PDF, DOCX

Button:

"Analyze Contract"

Also include a small section explaining:

• AI-powered contract analysis

• Risk detection

• Obligation tracking

• Deadline monitoring

• Ask questions about your contract

==================================================

4. CONTRACT ANALYSIS DASHBOARD

==================================================

After uploading a document, show a dashboard containing:

A. CONTRACT OVERVIEW

Display:

Contract Name

Contract Type

Parties Involved

Effective Date

Expiration Date

Renewal Terms

Contract Status

B. KEY CLAUSES

Create cards for:

• Payment Terms

• Termination

• Renewal

• Confidentiality

• Liability

• Service Obligations

• Penalties

• Governing Law

Each clause should show a short explanation.

C. RISK ANALYSIS

Show risk cards with:

Risk Level:

LOW / MEDIUM / HIGH

Risk Title

Explanation

Recommended Action

Use clear visual indicators.

Example:

HIGH RISK

Automatic Renewal

"The agreement automatically renews unless notice is provided 30 days before expiration."

Recommended Action:

"Set a reminder 45 days before expiration."

D. OBLIGATIONS

Create an obligations table:

Obligation

Responsible Party

Due Date

Status

Priority

Example:

Submit monthly report | Client | 15 Nov 2026 | Pending | High

E. IMPORTANT DATES

Show a timeline/calendar-style section containing:

Contract start date

Payment dates

Reporting deadlines

Renewal date

Termination notice deadline

Expiration date

==================================================

5. AI CONTRACT CHAT

==================================================

Add a prominent AI chat panel called:

"Ask ContractLens"

Users should be able to ask questions such as:

"What is the termination notice period?"

"When does this contract expire?"

"What are the payment terms?"

"Are there any automatic renewal clauses?"

"What are the major risks?"

"What obligations does the client have?"

The AI should answer using information from the uploaded contract.

Include suggested question buttons.

==================================================

6. AI ACTIONS

==================================================

Make the application agentic by providing actions after analysis.

Example buttons:

"Create Deadline Reminder"

"Show High-Risk Clauses"

"Generate Executive Summary"

"Show All Obligations"

"Explain This Clause"

When the user selects an action, show the AI performing the requested task.

==================================================

7. EXECUTIVE SUMMARY

==================================================

Generate a concise executive summary containing:

Contract purpose

Parties

Duration

Financial terms

Major obligations

Important deadlines

Major risks

Recommended actions

Keep the summary easy to understand for a non-legal user.

==================================================

8. EVALUATION ALIGNMENT

==================================================

The application should visibly demonstrate the following hackathon evaluation areas:

1. Problem Understanding – 15%

2. Prototype Quality & UX – 20%

3. AI Integration – 25%

4. Innovation & Creativity – 15%

IMPORTANT:

Do NOT display or mention the "LinkedIn Content + Engagement" evaluation category.

Do NOT create a LinkedIn section.

Do NOT add LinkedIn buttons, links, sharing, posting, engagement tracking, or analytics.

Focus the application UI and functionality on the four relevant evaluation areas above.

==================================================

9. UI/UX DESIGN

==================================================

Use a premium modern SaaS design.

Style:

• Clean professional interface

• Dark/light modern theme

• Blue/purple accent colors

• Rounded cards

• Soft shadows

• Professional typography

• Responsive design

• Clear navigation

• Smooth animations

• Excellent spacing

• Dashboard-style layout

The interface should look like a real enterprise AI product rather than a basic student project.

Use icons where appropriate.

==================================================

10. NAVIGATION

==================================================

Create a sidebar with:

Dashboard

Contracts

Obligations

Risks

Important Dates

AI Assistant

Reports

Top-right:

User profile

Notifications

==================================================

11. DEMO DATA

==================================================

If no contract is uploaded, provide a realistic demo contract so the complete application can be demonstrated immediately.

Create a sample:

"ABC Technologies - XYZ Services Agreement"

Include realistic:

• Contract parties

• Dates

• Payment terms

• Renewal clause

• Termination clause

• Confidentiality clause

• Service obligations

• Deadlines

• Risks

Make the demo data clearly labeled as SAMPLE/DEMO DATA.

==================================================

12. TECHNICAL REQUIREMENTS

==================================================

Build the application with a clean component-based architecture.

Use:

React

TypeScript

Tailwind CSS

Modern UI components

Lucide icons

Create reusable components for:

ContractCard

RiskCard

ObligationTable

ClauseCard

DeadlineTimeline

AIChat

UploadArea

AnalysisProgress

DashboardStats

Keep the code organized and production-quality.

==================================================

13. IMPORTANT DEMO EXPERIENCE

==================================================

The most important hackathon demo flow should be:

1. Open ContractLens

2. Upload/select a sample contract

3. Click "Analyze Contract"

4. Show the AI agent performing multiple analysis steps

5. Display extracted contract information

6. Display risks

7. Display obligations

8. Display deadlines

9. Ask the AI a question

10. Generate an executive summary

11. Create/show an action or reminder

Make this flow smooth and visually impressive.

==================================================

14. FINAL REQUIREMENT

==================================================

Do NOT make this application look like a simple chatbot.

The main focus must be:

DOCUMENT UNDERSTANDING

+

AI REASONING

+

RISK DETECTION

+

OBLIGATION TRACKING

+

DEADLINE MONITORING

+

AI ACTIONS

The final product should clearly demonstrate an autonomous Agentic AI workflow.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/83616012-457f-4263-8490-a4dfb76a66ac).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
