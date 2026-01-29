# High-Level Flow Overview

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

# Detailed Step-by-Step Workflow

## STEP 1 — Ops Team Pickup Creation UI

### Screen: "Create Collection Session"

Ops team should see a form with:

Mandatory fields:

- Patient Name
- Phone Number
- Optional: Age, Gender, City
- **Agent Assignment** (optional) — Select from list of active agents

Actions:

- Save Session
- Proceed to Form Configuration

After submission:

- A unique internal session ID is created
- Agent assignment is recorded (if selected)
- User is redirected to form selection screen

## STEP 2 — Form Selection UI

### Screen: "Select Required Documents"

Ops team must see checklist of available document types:

Initial supported types:

- Test Request Form (TRF)
- Doctor Prescription
- Histopathology / Tumor Report
- Form G (NIPT / Rare Disease)

Features:

- Multi-select support
- Ability to skip any document
- Continue button enabled only if at least one form selected

Future Scope (Not Now):

- Ops creating new form templates

## STEP 3 — Dynamic Form Builder UI

For EACH selected document:

### Screen: "Build Digital Form"

Ops team must be able to:

### Add Field Types:

- Text input
- Number input
- Dropdown select
- Date picker

### Field Configuration:

Each field must support:

- Label name
- Required / optional toggle
- Placeholder text (optional)
- Dropdown options (if applicable)

### UI Controls

For each added field:

- Delete button
- Field preview mode

Current Scope:

- drag-and-drop ordering

### Save Form Behavior

When Ops clicks:

Save Form

System must:

- Store form schema locally (frontend state for now)
- Link schema to pickup session
- Allow editing until link is generated

## STEP 4 — Generate Shareable Link

### Screen: "Generate Collection Link"

After all selected forms are built:

Ops sees:

- Summary of required documents
- Summary of digital fields created
- **Agent Assignment Section** — Assign or change agent before submission
- Button: "Generate Link"

### Agent Reassignment Rules

- Ops can assign/reassign agents at any time before session is submitted
- Agent dropdown available on:
  - Dashboard session cards
  - Review page (session details)
- Once session status is `submitted`, agent assignment is **locked**
- Only active agents appear in the dropdown

### Generated Link Behavior

Link must:

- Be unique per pickup session
- Open public submission UI
- Not require login
- Work on mobile browser
- Be shareable via WhatsApp/SMS

## STEP 5 — Public Submission UI (Pablo / Patient)

### Screen: "Submit Required Information"

User must see two options:

### Option A — Upload Using Camera

For each required document:

- Camera capture button
- Gallery upload support
- Preview uploaded image
- Retake option

### Option B — Fill Digital Form

User can:

- Open digital form created by Ops
- Enter data
- Submit structured fields

### Validation Rules

Submission must be blocked if:

- Mandatory documents missing
- Required form fields empty

### Submit Behavior

When user submits:

System must:

- Show success confirmation
- Lock form from re-editing
- Mark session as "Submitted"

## STEP 6 — Ops Team Monitoring Dashboard

### Screen: "Active Collection Sessions"

Ops team must see:

### Session Summary Cards

At the top of the dashboard, display summary statistics:

- **Completed** — Count of sessions with status "submitted"
- **Yet to Complete** — Count of all sessions not yet submitted
- **Needs Link** — Count of sessions with status "created" (link not generated)
- **Total Sessions** — Total count of all sessions

### Session List

For each session:

- Patient Name
- Phone Number
- **Agent Selector** — Dropdown to assign/change agent (if not submitted)
- Status badge:

Status Types:

- Created
- Link Generated
- In Progress
- Submitted (agent locked)
- Incomplete

### Detail View

Clicking a session should show:

- Uploaded images
- Entered digital form data
- Timestamp
- Completion percentage
- **Agent Assignment** — View or change assigned agent

## STEP 7 — Agent Management

### Screen: "Manage Agents"

Ops team must see:

### Agent Summary Cards

- **Total Agents** — Count of all agents
- **Active Agents** — Count of agents available for assignment
- **Inactive Agents** — Count of disabled agents

### Agent List

For each agent:

- Agent Name
- Phone Number
- Status Badge (Active/Inactive)
- Session Count — Number of assigned sessions
- Edit / Toggle Status buttons

### Agent Form

Fields:

- Agent Name (required)
- Phone Number (required)
- Status (Active/Inactive)

## STEP 8 — Incentive Management

### Screen: "Incentive Dashboard"

Ops team must see:

### Incentive Cards

For each pending incentive:

- Session details (Patient Name, ID)
- Agent Name
- Breakdown:
  - Per Session Bonus
  - On-Time Bonus
  - Compliance Bonus
- Total Amount
- Approve / Reject buttons

### Incentive Calculation Rules

Incentives are calculated automatically when:

- Session status changes to `submitted`
- Session has an assigned agent

**Breakdown Components:**

1. **Per Session Bonus** — Fixed amount for completing any session
2. **On-Time Bonus** — Awarded if submitted within configured time window
3. **Compliance Bonus** — Awarded if all required documents are complete

### Screen: "Payout Reports"

Ops team must see:

- List of approved incentives grouped by agent
- Total payout amount
- Export to CSV button
- Mark as Paid functionality

# Data Storage Scope (Current Phase)

For now:

- Store all data in frontend state / local storage / mock service
- No backend persistence required
- **Stored Entities:**
  - Sessions (with agent assignments)
  - Agents
  - Incentives
  - Payout Batches

Later Phase:

- Replace with API + database

# Non-Functional Requirements

## Mobile First

Public submission UI must:

- Be optimized for mobile
- Use large tap targets
- Minimal typing required
- Camera-first UX

## Performance

- Lazy load form components
- Avoid heavy UI libraries
- Use dynamic imports where needed

## Security (Basic Phase)

- Links must be hard to guess (UUID)
- No indexing by search engines
- No public listing

# Future Scope (Not Required Now)

- Offline upload queue
- Role-based access
- Backend persistence
- Analytics dashboard
- Regional form templates
- Bulk agent import
- Incentive configuration UI (customize bonus amounts)
