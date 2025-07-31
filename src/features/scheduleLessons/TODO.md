# ScheduleLessons Todo

- [ ] Check for any Data anomalies (insert, update, delete)
- [ ] ComponentInsert/Update type has been created. Where is ComponentDelete?
- [ ] Support multi-user (sync with backend, not just localStorage).
- [ ] Add aggregation/stats for class groups.
- [ ] Add search/filter, aggregation, and multi-user support.
- [ ] Should have commit/rollback functionality for services to prevent partial data.

- [ ] Transition from context+providers into react query (useClassSessions.ts hook is already implemented)

- [ ] UI issue: separate submit loading in forms vs fetching loading in lists.

## Provider fixes

### TimetableProvider

- Optimize timetable loading by batching session fetches instead of fetching each session individually in a loop.
- Add retry or fallback mechanism for failed timetable fetch or update operations.
- Improve conflict detection UX by providing detailed conflict info (e.g., what conflicts, where).
- Introduce optimistic UI updates to reduce waiting time for users.
- Add unit/integration tests covering timetable assignment and movement logic.
- Extract repeated logic for updating timetable state into reusable helpers.

---

### CoursesProvider

- Debounce or throttle rapid add/update/remove calls to avoid race conditions.
- Improve error handling by categorizing errors (network vs validation).
- Add caching or memoization to reduce unnecessary refetches.
- Implement pagination or lazy loading for large course lists.
- Add optimistic UI updates for smoother UX.
- Add unit tests for CRUD operations and state management.

---

### ClassroomsProvider

- Similar to CoursesProvider: add caching, debounce updates, optimistic updates.
- Implement search or filtering capabilities on classrooms list.
- Add validations or business rules (e.g., unique classroom names).
- Improve error messages for better user feedback.
- Add tests for state transitions and CRUD flows.

---

### ClassGroupsProvider

- Add caching/memoization to minimize repeated fetches.
- Add pagination or filtering support for large groups.
- Add validation (e.g., no duplicate group names).
- Add optimistic UI updates.
- Improve error handling UX (e.g., show friendly messages).
- Add tests covering add, update, and delete flows.

---

### ClassSessionsProvider

- Optimize fetching by reducing dependency-triggered refetches (e.g., batch or debounce).
- Consider updating local state after mutations instead of full refetch, to improve performance.
- Improve error handling with detailed messages or retry options.
- Add validation to session data before submitting.
- Add optimistic updates where possible.
- Add tests for fetch logic reacting to dependency changes and CRUD operations.

---

If you'd like, I can also help prioritize these or create detailed tickets!
