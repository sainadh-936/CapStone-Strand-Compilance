# Strand Logistics — Sample Collection Compliance System

A mobile-first Next.js application for Strand Life Sciences to streamline diagnostic sample collection documentation and improve freelancer compliance.

## 🎯 Problem Statement

Third-party phlebotomists often skip documentation (TRFs, prescriptions, reports), causing samples to arrive at the lab incomplete. This system provides a frictionless way to collect required documents via shareable links.

## 🔄 High-Level Flow

```
Ops creates pickup session
        ↓
Ops assigns agent (optional)
        ↓
Ops selects required documents
        ↓
Ops builds digital forms (optional)
        ↓
System generates shareable link
        ↓
Ops can reassign agent anytime (before submission)
        ↓
Pablo/Patient submits via mobile
        ↓
Ops monitors completion on dashboard
        ↓
System calculates agent incentives
        ↓
Ops approves incentives & exports payouts
```

## 📱 Key Features

### Session Management
- **Pickup Session Management** — Create and track sample collection sessions
- **Session Summary Dashboard** — View statistics (completed, pending, needs link)
- **Dynamic Form Builder** — Ops can design custom forms per document type
- **Shareable Links** — Unique URLs for each session (no login required)
- **Mobile-First Upload** — Camera capture + gallery upload for documents
- **Real-time Dashboard** — Track submission status across all sessions

### Agent Management
- **Agent Directory** — Add, edit, and manage phlebotomist agents
- **Agent Status** — Mark agents as active or inactive
- **Agent Assignment** — Assign agents to sessions during creation
- **Agent Reassignment** — Change assigned agent anytime before session is submitted
  - Available on Dashboard (session cards)
  - Available on Review page (session details)
  - Locked once session status is `submitted`

### Incentive System
- **Automatic Calculation** — Incentives calculated when session is submitted
- **Incentive Components:**
  - Per Session Bonus — Base amount for completing a session
  - On-Time Bonus — Extra for submitting within time window
  - Compliance Bonus — Extra for complete documentation
- **Approval Workflow** — Ops can approve/reject calculated incentives
- **Payout Reports** — Export approved incentives for payment processing

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI Library:** Material UI (MUI)
- **Rendering:** Server Components by default, Client Components for interactivity
- **Storage:** Local Storage (Phase 1)
- **Theming:** Custom MUI theme with responsive design

## 📁 Project Structure

```
src/
├── app/                      # Routes and layouts
│   ├── agents/               # Agent management
│   │   └── [id]/             # Agent details
│   ├── dashboard/            # Ops monitoring with session summary
│   ├── incentives/           # Incentive management
│   │   └── reports/          # Payout reports & export
│   ├── session/              # Session management
│   │   ├── new/              # Create new session
│   │   └── [id]/             # Session details
│   │       ├── documents/    # Document selection
│   │       ├── forms/        # Form builder
│   │       └── review/       # Review, agent assignment & generate link
│   └── submit/[id]/          # Public submission page
├── components/               # Reusable UI components
│   ├── dashboard/            # Dashboard-specific components
│   │   └── SessionSummary    # Session statistics cards
│   ├── layout/               # Header, Footer
│   └── ui/                   # Base components (Button, Card, Badge, Input)
├── features/                 # Business domain modules
│   ├── agents/               # Agent management components & schemas
│   ├── documents/            # Document type definitions
│   ├── forms/                # Form builder & field components
│   ├── incentives/           # Incentive calculation & components
│   ├── review/               # Review page components
│   └── sessions/             # Session schemas & validation
├── lib/                      # Utilities and helpers
│   └── storage.ts            # Local storage operations
├── theme/                    # MUI theme configuration
│   ├── theme.ts              # Theme definition
│   └── ThemeProvider.tsx     # Theme context provider
└── types/                    # TypeScript definitions
    └── index.ts              # Core type definitions
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Session Statuses

| Status | Description |
|--------|-------------|
| `created` | Session created, documents not yet selected |
| `link_generated` | Shareable link created, awaiting submission |
| `in_progress` | Patient has started submitting documents |
| `submitted` | All required documents submitted (agent locked) |
| `incomplete` | Partial submission or issues |

## 👤 Agent Statuses

| Status | Description |
|--------|-------------|
| `active` | Agent available for assignment |
| `inactive` | Agent not available for new assignments |

## 💰 Incentive Statuses

| Status | Description |
|--------|-------------|
| `pending` | Incentive calculated, awaiting approval |
| `approved` | Incentive approved for payout |
| `rejected` | Incentive rejected |
| `paid` | Incentive paid out |

## 📖 Documentation

- [instructions.md](./instructions.md) — Detailed workflow and feature specifications
- [codingStandards.md](./codingStandards.md) — Mandatory coding rules and architecture guidelines

## 🔮 Future Scope

- Backend API integration
- Offline upload queue
- Role-based access control
- Analytics dashboard
- Theme customization (Strand Life Sciences branding)
