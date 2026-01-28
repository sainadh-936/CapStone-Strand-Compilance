Coding Standards — Mandatory Rules
==================================

## Architecture & Organization

1.  Follow **modular architecture** — each business feature must be isolated and independently extendable.
    
2.  Maintain **strict separation of concerns** — never mix UI rendering, business logic, and API/network logic in the same file.
    
3.  Default to **server-side rendering** and use client-side logic only for interactions like forms, uploads, and live UI updates.

4.  **Component organization** — group components by domain:
    - `components/ui/` — Base reusable components (Button, Card, Input, Badge)
    - `components/layout/` — Layout components (Header, Footer)
    - `components/dashboard/` — Dashboard-specific components
    - `features/*/components/` — Feature-specific components

5.  **Extract reusable logic** — when a component grows complex or is used in multiple places, extract it into its own file.

## Component Guidelines

6.  UI components must be **presentation-focused only** — no fetch calls, no business rules, no data mutations.

7.  Use **MUI (Material UI)** as the primary component library with custom theme overrides.
    
8.  All API communication must go through a **dedicated data access layer**, never directly from UI components.
    
9.  Every user input must go through **centralized schema-based validation** (using Zod) before submission.

## State Management

10.  Follow **unidirectional data flow** — user action → validation → business logic → persistence → UI update.
    
11.  Use **local state for UI behavior** and **global state only for shared session or auth context**.

12.  Use **useMemo/useCallback** for expensive computations and callback stability.

## Code Quality

13.  Use **descriptive naming** for variables, functions, and components — avoid abbreviations and generic names.
    
14.  Keep files **small and focused** — split logic when files become large or complex.
    
15.  Handle all **error states explicitly** — network failures, validation errors, and unexpected input must show user feedback.

## Performance

16.  Optimize for **mobile performance first** — minimize client JS, lazy-load heavy components, optimize uploads.

17.  Use **responsive design** with MUI's `sx` prop for breakpoint-based styling.

## Security & Configuration

18.  Never hardcode **URLs, secrets, or configuration values** — always use environment-based configuration.
    
19.  Design new features to be **backward compatible and non-breaking** — avoid modifying unrelated modules.

## Completeness Checklist

20.  Before considering a feature complete, ensure it has **validation, error handling, responsive UI, and clean architecture**.