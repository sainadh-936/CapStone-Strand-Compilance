# Strand Logistics — Sample Collection Compliance System

A mobile-first Next.js application for Strand Life Sciences to streamline diagnostic sample collection documentation and improve freelancer compliance.

## 🎯 Problem Statement

Third-party phlebotomists often skip documentation (TRFs, prescriptions, reports), causing samples to arrive at the lab incomplete. This system provides a frictionless way to collect required documents via shareable links.

## 🔄 High-Level Flow

```
Ops creates pickup session
        ↓
Ops selects required documents
        ↓
Ops builds digital forms (optional)
        ↓
System generates shareable link
        ↓
Pablo/Patient submits via mobile
        ↓
Ops monitors completion on dashboard
```

## 📱 Key Features

- **Pickup Session Management** — Create and track sample collection sessions
- **Dynamic Form Builder** — Ops can design custom forms per document type
- **Shareable Links** — Unique URLs for each session (no login required)
- **Mobile-First Upload** — Camera capture + gallery upload for documents
- **Real-time Dashboard** — Track submission status across all sessions

## 🛠 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Rendering:** Server Components by default
- **Storage:** Frontend state / Local Storage (Phase 1)

## 📁 Project Structure

```
src/
├── app/                  # Routes and layouts
│   ├── dashboard/        # Ops monitoring
│   ├── pickups/          # Session management
│   └── submit/[id]/      # Public submission page
├── features/             # Business domain modules
│   ├── sessions/         # Pickup session logic
│   ├── forms/            # Form builder & schemas
│   └── documents/        # Document upload handling
├── components/           # Reusable UI components
├── lib/                  # Utilities and helpers
└── types/                # TypeScript definitions
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Documentation

- [instructions.md](./instructions.md) — Detailed workflow and feature specifications
- [codingStandards.md](./codingStandards.md) — Mandatory coding rules and architecture guidelines

## 🔮 Future Scope

- Backend API integration
- Offline upload queue
- Role-based access control
- Incentive auto-calculation
- Analytics dashboard
