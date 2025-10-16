# Maintenance & Refactoring Strategy

This document outlines strategy and principles for long-term health of the ClassFlow codebase (formerly UniScheduleWeave). See README and coding-guidelines.md for definitive standards. For specific maintenance backlogs, see Backlogs.md.

## Guiding Principles (Condensed)
- Prioritize improvements with greatest user and maintainability impact
- Align maintenance with coding-guidelines.md phases & standards
- Safeguard data integrity during all refactors
- "Leave it better than you found it"

## Code Health Monitoring

The need for refactoring is identified through several channels:

- **Automated Tooling**: ESLint and TypeScript compiler errors are considered blockers and must be fixed immediately.
- **Code Reviews**: The Pull Request process is our primary mechanism for identifying architectural inconsistencies, potential bugs, and areas for improvement.
- **Performance Profiling**: Using React Developer Tools and browser performance audits to identify slow renders or bottlenecks, especially in the `Timetable` component.
- **User Feedback**: Direct feedback from users or bug reports often highlight underlying architectural issues that need to be addressed.

## Refactoring Strategy

Refactoring is an ongoing process, not a separate phase. Our strategy is as follows:

1. **Identify and Document**: When a potential refactoring is identified, it should be documented as an issue or added to the `TODO.md` file with a clear description of the problem and the proposed solution.
2. **Prioritize**: Tasks are prioritized based on the urgency and impact (Critical, High, Medium, Long-Term) in the `TODO.md` file. This ensures we are always working on the most valuable improvements.
3. **Implement with Tests**: Any significant refactoring of business logic (e.g., in `utils` or `hooks`) must be accompanied by unit or integration tests to prevent regressions.

## Current Roadmap

For the most up-to-date list of planned maintenance, refactoring tasks, and new features, please refer to the official project roadmap:

➡️ **[View the Current Roadmap (TODO.md)](./TODO.MD)**
