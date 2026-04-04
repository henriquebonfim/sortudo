## Project: Odds Are Not With You (The Math of Mega-Sena)
### Structured Action Plan (TODO)

> Last updated: 2026-04-03 · Summary of remaining technical and UX debt.
> `[ ]` = pending task.

---

## 🔴 CRITICAL — Architect's Road to 10/10

### 🏗️ A. Architecture Enforcement & Documentation
- [ ] **Implement Dependency Boundaries:** Add `eslint-plugin-import` or `dependency-cruiser` to strictly enforce DDD layers.
  - *Goal:* Prevent `src/domain` from importing anything from `src/features` or `src/infrastructure`.
- [ ] **Architecture Decision Records (ADRs):** Create a `/docs/adr/` directory and document major choices (e.g., Zustand for state, DDD over MVC).
  - *Goal:* Provide the "why" behind the "how" for future maintainers.

### 🧪 B. Advanced Quality Assurance
- [ ] **Property-Based Testing for Domain Math:** Use `fast-check` to validate lottery probability logic in `src/domain/math`.
  - *Goal:* Verify mathematical invariants across 1,000+ random inputs instead of hardcoded unit tests.
- [ ] **Layer-Specific Coverage Gates:** Configure Vitest to enforce higher coverage (e.g., 95%+) specifically on the `src/domain` directory.

---

## 🟡 HIGH

### 🏠 A. Home Page Structure & Composition
- [ ] **Extract Page Logic to Features:** Refactor `src/pages/DataDashboard.tsx` to move heavyweight logic into `src/features/analytics-dashboard`.
  - *Goal:* Keep the `pages` layer thin and purely compositional.

### ⛓️ B. Infrastructure & DevOps
- [ ] **Dev Container Support:** Add a `.devcontainer/` configuration to ensure environment parity (Bun version, extensions).
- [ ] **Data Pipeline Validation:** Add Zod schema validation to the `fetch:json` script to fail builds early if external data formats change.

---

## 🟡 MEDIUM

- [ ] **Interactive historical timeline:** Clickable chart of all jackpots over ~30 years with milestone annotations.
- [ ] **Containerization:** Create a multi-stage `Dockerfile` to optimize the deployment image for performance and security.

---

## 🔵 LOW — New Features & Polish

- [ ] **Dark Mode Refinement:** Ensure all glassmorphism effects in the UI have proper fallbacks for low-power devices.
- [ ] **Performance Benchmarks:** Run Web Vitals audit and document the performance budget in README.md.

---
