/*
Certainly! Here's a **condensed checklist** of future refactoring notes based on your current structure:

---

### 🔧 **Auth Layer Refactor Notes**

#### ✅ `authApi.ts`

* [ ] **Keep clean**: Only call Supabase SDK, no business logic or user messages.
* [ ] **Throw raw errors**: Let services map them.

#### ✅ `authService.ts`

* [ ] **Handle logic**: Map Supabase errors to user-friendly messages.
* [ ] **Move fallback logic**: e.g. default user names, empty tokens.
* [ ] **Use utility**: Centralize error mapping via `mapAuthErrorMessage()`.

#### ✅ `AuthContext.tsx`

* [ ] ✅ Already clean and side-effect aware (navigation, session, error).
* [ ] \[Optional] Extract localStorage syncing into a separate utility.

---

### 🧾 **Error Handling**

* [ ] Create `utils/errorUtils.ts` for reusable error mapping:

  * e.g. `mapAuthErrorMessage(error.message)`

---

### 📝 **Form Validation**

* [ ] Replace manual validation with `react-hook-form` + `yup` or `zod`.
* [ ] Use schema-based validation for consistency and maintainability.

---

### 🚀 Optional Enhancements

* [ ] Add session expiry detection or token refresh.
* [ ] Use toast notifications for feedback instead of inline text.
* [ ] Lazy-load routes for auth pages to improve performance.
* [ ] Make structure extensible for social login / MFA.

 */
