# Testing & QA Guide

## Philosophy

- **Test Core Logic First:** Focus on pure functions and business logic (see `timetableLogic.ts`).
- **Incremental Coverage:** Start with unit tests, expand to integration and e2e as the app grows.
- **Fail Fast:** Run tests and lint checks after every commit.

## Where Are the Tests?

- Unit tests live alongside the logic they test, e.g.:
  - `src/features/scheduleLessons/utils/timetableLogic.test.ts`
- Future integration and e2e tests will be added in `/tests` or `/cypress`.

## How to Run Tests

```bash
npm run test
```

Or, if using Jest directly:

```bash
npx jest
```

## What to Test

- **Business Logic:** Conflict detection, assignment, and move logic in `timetableLogic.ts`.
- **Hooks & Contexts:** Add tests for custom hooks and context logic as features stabilize.
- **UI:** Add tests for forms and components as needed (see Storybook for visual testing).

## Example: Timetable Logic

See `src/features/scheduleLessons/utils/timetableLogic.test.ts` for examples of unit tests covering conflict detection and assignment.

## Future Plans

- Add integration tests for context and service interactions.
- Add e2e tests for user flows (e.g., login, schedule creation).
- Document test coverage and error codes as the app matures.
