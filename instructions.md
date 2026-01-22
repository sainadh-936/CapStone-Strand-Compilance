High-Level Flow Overview
========================

Ops creates pickup       
↓  
Ops designs required forms
↓  
Ops generates secure link
↓  
Link shared to Pablo/Patient
↓  
User submits data (Upload OR Fill Forms)
↓  
Ops dashboard updates completion status

Detailed Step-by-Step Workflow
==============================

STEP 1 — Ops Team Pickup Creation UI
------------------------------------

### Screen: "Create Collection Session"

Ops team should see a form with:

Mandatory fields:

*   Patient Name
    
*   Phone Number
    
*   Optional: Age, Gender, City
    

Actions:

*   Save Session
    
*   Proceed to Form Configuration
    

After submission:

*   A unique internal session ID is created
    
*   User is redirected to form selection screen
    

STEP 2 — Form Selection UI
--------------------------

### Screen: "Select Required Documents"

Ops team must see checklist of available document types:

Initial supported types:

*   Test Request Form (TRF)
    
*   Doctor Prescription
    
*   Histopathology / Tumor Report
    
*   Form G (NIPT / Rare Disease)
    

Features:

*   Multi-select support
    
*   Ability to skip any document
    
*   Continue button enabled only if at least one form selected
    

Future Scope (Not Now):

*   Ops creating new form templates
    

STEP 3 — Dynamic Form Builder UI
--------------------------------

For EACH selected document:

### Screen: "Build Digital Form"

Ops team must be able to:

### Add Field Types:

*   Text input
    
*   Number input
    
*   Dropdown select
    
*   Date picker
    

### Field Configuration:

Each field must support:

*   Label name
    
*   Required / optional toggle
    
*   Placeholder text (optional)
    
*   Dropdown options (if applicable)
    

### UI Controls

For each added field:

*   Delete button
    
*   Field preview mode
    

Current Scope:
    
*   drag-and-drop ordering
    

### Save Form Behavior

When Ops clicks:

Save Form

System must:

*   Store form schema locally (frontend state for now)
    
*   Link schema to pickup session
    
*   Allow editing until link is generated
    

STEP 4 — Generate Shareable Link
--------------------------------

### Screen: "Generate Collection Link"

After all selected forms are built:

Ops sees:

*   Summary of required documents
    
*   Summary of digital fields created
    
*   Button: "Generate Link"
    

### Generated Link Behavior

Link must:

*   Be unique per pickup session
    
*   Open public submission UI
    
*   Not require login
    
*   Work on mobile browser
    
*   Be shareable via WhatsApp/SMS
    

STEP 5 — Public Submission UI (Pablo / Patient)
-----------------------------------------------

### Screen: "Submit Required Information"

User must see two options:

### Option A — Upload Using Camera

For each required document:

*   Camera capture button
    
*   Gallery upload support
    
*   Preview uploaded image
    
*   Retake option
    

### Option B — Fill Digital Form

User can:

*   Open digital form created by Ops
    
*   Enter data
    
*   Submit structured fields
    

### Validation Rules

Submission must be blocked if:

*   Mandatory documents missing
    
*   Required form fields empty
    

### Submit Behavior

When user submits:

System must:

*   Show success confirmation
    
*   Lock form from re-editing
    
*   Mark session as "Submitted"
    

STEP 6 — Ops Team Monitoring Dashboard
--------------------------------------

### Screen: "Active Collection Sessions"

Ops team must see:

For each session:

*   Patient Name
    
*   Phone Number
    
*   Status badge:
    

Status Types:

*   Created
    
*   Link Generated
    
*   In Progress
    
*   Submitted
    
*   Incomplete
    

### Detail View

Clicking a session should show:

*   Uploaded images
    
*   Entered digital form data
    
*   Timestamp
    
*   Completion percentage
    

Data Storage Scope (Current Phase)
==================================

For now:

*   Store all data in frontend state / local storage / mock service
    
*   No backend persistence required
    

Later Phase:

*   Replace with API + database
    

Non-Functional Requirements
===========================

Mobile First
------------

Public submission UI must:

*   Be optimized for mobile
    
*   Use large tap targets
    
*   Minimal typing required
    
*   Camera-first UX
    

Performance
-----------

*   Lazy load form components
    
*   Avoid heavy UI libraries
    
*   Use dynamic imports where needed
    

Security (Basic Phase)
----------------------

*   Links must be hard to guess (UUID)
    
*   No indexing by search engines
    
*   No public listing
    

Future Scope (Not Required Now)
===============================
    
*   Offline upload queue
    
*   Role-based access
    
*   Backend persistence
    
*   Analytics dashboard
    
*   Regional form templates
    
*   Incentive auto-calculation