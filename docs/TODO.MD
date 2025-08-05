# Todos

1. [x] **Implement Basic Conflict Detection (Core MVP Feature)**
    - A scheduler's primary value is preventing conflicts. This is a core piece of business logic that makes your application truly useful. It fits perfectly within your existing architecture.
2. [x] **Backend Integration with Supabase (MVP Foundation)**
    - Your roadmap correctly identifies this as an MVP task. Moving from localStorage to a real backend is the single most important step to enable persistence, sharing, and future features like multi-user collaboration.
3. [x] **Write Unit Tests for Core Logic**
    - Once conflict detection and the core data flow are in place, it's the perfect time to write tests. This aligns with your "Post-MVP (Short-Term)" plan to solidify your business logic before adding more complexity.
4. [x] **Admin Academic Setup**
    - This is a great next feature. It makes the application dynamic and configurable, moving beyond hardcoded values and empowering administrators.
5. **Refactor/Enhance UI as Needed**
    - Your architecture is already very clean. I would advise against a major UI overhaul (like a single-page UI) until you have a clearer need. Let new features drive any necessary refactoring.
6. **Multi-user Assignment**
    - This is a "Long-Term / Scaling Phase" feature. It depends on a solid backend, authentication, and likely real-time capabilities. It's best to tackle this once the single-user experience is complete and tested.
7. **Implement Dynamic Timetable Views**
    - Allow users to pivot the timetable data, viewing schedules by class group, instructor, classroom, or course.
    - This feature enhances the scheduler's flexibility and caters to different user needs.

8. **Other Important Tasks**  
   - Update imports throughout the codebase to use the new structure.
   - Add or improve inline documentation for non-obvious logic.
   - Add TODO comments for future features (conflict detection, multi-user, aggregated views).
   - Review and update README.md to reflect the new structure and best practices.

9. **Testing and Validation**  
   - After each atomic commit, run lint and type checks.
   - Add or update unit tests for hooks and context logic.

This plan will make your codebase more modular, easier to test, and ready for future scaling. Once you are ready to implement, please toggle to Act mode.
