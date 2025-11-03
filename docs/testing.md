# Testing Approach & Philosophy

This document explains the engineering principles and strategies that guide all testing in the ClassFlow codebase. It is not a feature or version-specific status log, but a statement of core practices.

## Principles

- **Test what matters:** Focus on business-critical flows, role-based edge cases, and scenarios that could break in real life. Strive for confidence, not just coverage.
- **Layered/Pyramid model:**
  - Written primarily as fast, focused unit tests (functions/services)
  - Key integrations and user workflows are covered by integration/component tests
  - Workflow and real-time tests verify the “happy path” and all role-based error/cross-user/race conditions
  - E2E and UI tests exist only for critical paths
- **Mocks and Isolation:** External dependencies—Supabase, context, window—are always mocked in all but the highest-level tests. “Always-unit-first” principle is enforced whenever code can be tested as a pure function.
- **Critical path, not exhaustive lists:** Tests guarantee correct behaviors under normal, failure, race, and multi-user cases. Coverage is “meaningful” not merely “high.”

## Test Types & Examples

### 1. Unit Tests
- **What:** Functions, logic branches, edge cases.
- **Example:**
  - conflict detection in timetable assignment
  - correct role identification from JWT
- **Tools:** Vitest, mock/stub dependencies

### 2. Integration/Component Tests
- **What:** Important hooks (React Query/mutations, multi-context logic), form workflows, notifications, permission-controlled actions.
- **Example:**
  - “Approve”/“Reject” actions and feedback in modals
  - Pending → confirmed session flow for cross-department requests
- **Tools:** React Testing Library, in-memory router/context

### 3. Workflow (Multi-Step/Role/Realtime) Tests
- **What:** End-to-end process as it spans database, service, hooks, UI, and real-time updates.
- **Example:**
  - Cross-dept resource assignment: confirm, move, reject/cancel; notification updates
  - Query invalidation and instant UI sync for all users
- **Tools:** Layered mocks, supabase event simulation, scenario scripts

### 4. Permissions & Security (RLS, Access Control)
- **What:** Explicitly assert RLS policies, role-blocked UI, allowed/disallowed API use.
- **How:** Simulate users with/without rights; test direct DB function access; verify optimistic/defensive UI fallback

### 5. Realtime (Subscriptions, Invalidation, Edge-Cases)
- **What:** Simulate channel events, verify query invalidation, no double-subscriptions; teardown/cleanup checks.
- **How:** Use wrapper modules for all real-time clients; test error and “unknown event” resilience

## Running Tests

Run all tests:
```bash
npm run test
```
Individual or focused runs are equally supported (see README/docs for patterns).

## Documentation Flow
- **Implementation status/tracking for any feature:** recorded in its feature plan, not here.
- **Critical edge-case or test-related bugs:** belong in tickets or as doc comments in the affected feature files.
- **This guide will stay timeless—example-driven, not checklist-driven.**
