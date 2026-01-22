Coding Standards — Mandatory Rules
==================================

1.  Follow **modular architecture** — each business feature must be isolated and independently extendable.
    
2.  Maintain **strict separation of concerns** — never mix UI rendering, business logic, and API/network logic in the same file.
    
3.  Default to **server-side rendering** and use client-side logic only for interactions like forms, uploads, and live UI updates.
    
4.  UI components must be **presentation-focused only** — no fetch calls, no business rules, no data mutations.
    
5.  All API communication must go through a **dedicated data access layer**, never directly from UI components.
    
6.  Every user input must go through **centralized schema-based validation** before submission.
    
7.  Follow **unidirectional data flow** — user action → validation → business logic → persistence → UI update.
    
8.  Use **local state for UI behavior** and **global state only for shared session or auth context**.
    
9.  Use **descriptive naming** for variables, functions, and components — avoid abbreviations and generic names.
    
10.  Keep files **small and focused** — split logic when files become large or complex.
    
11.  Handle all **error states explicitly** — network failures, validation errors, and unexpected input must show user feedback.
    
12.  Optimize for **mobile performance first** — minimize client JS, lazy-load heavy components, optimize uploads.
    
13.  Never hardcode **URLs, secrets, or configuration values** — always use environment-based configuration.
    
14.  Design new features to be **backward compatible and non-breaking** — avoid modifying unrelated modules.
    
15.  Before considering a feature complete, ensure it has **validation, error handling, responsive UI, and clean architecture**.