# Codebase Review & Refactoring Instructions

## Context

This is **bite.** — a restaurant ordering app built with React, TypeScript, Vite, Tailwind, shadcn/ui, Supabase, and React Query. It supports two user flows: a diner-facing QR/menu experience and a restaurant-facing dashboard.

---

## Architecture Overview

### What's done well

**Folder structure** is logical and follows common React conventions:
- `pages/` for route-level components
- `components/` with domain sub-folders (`app/`, `landing/`, `menu/`, `restaurant/`)
- `contexts/` for global state
- `hooks/` for data-fetching abstractions
- `services/` for backend/API calls
- `types/` for shared TypeScript types

**Context layer** is well thought out — each concern is isolated (`AuthContext`, `CartContext`, `UserPreferencesContext`, `TableSessionContext`, `RestaurantConfigContext`, `SettingsContext`).

**Data fetching** properly uses React Query with the service layer abstracted behind `hooks/useMenu.ts` and `services/menuService.ts`.

---

## Issues That Warrant Refactoring

### 1. Context pyramid / provider nesting in `src/App.tsx`
There are 7 nested providers with inconsistent indentation, making it hard to read and maintain. This should be composed into a single `AppProviders` wrapper component.

### 2. `AppUserContext` is a fake auth layer
`src/contexts/AppUserContext.tsx` duplicates what `AuthContext` already does — it stores a hardcoded user (`"user-1"`, `"Jamie D."`) and a boolean flag set imperatively via `setAppUser(true)` on page mount. This is a leftover from before Supabase auth was wired in. It should be removed and its consumers migrated to `useAuth()`.

### 3. Inline Supabase queries in page components
`src/pages/Menu.tsx` defines `useDefaultRestaurant` and `useRestaurantById` hooks directly inside the page file. These belong in `hooks/useMenu.ts` or `services/menuService.ts`.

### 4. Mock data mixed with real services
`src/pages/QREntry.tsx` imports from `services/mockData.ts` and uses `setTimeout` for navigation. `src/pages/Login.tsx` also uses `setTimeout` + fake user flow instead of real Supabase auth. These pages are partially wired to real auth and partially to mocks — this inconsistency is a bug risk.

### 5. `data/` vs `services/` overlap
`src/data/restaurants.ts` contains static hardcoded restaurant data used in `Explore.tsx`, while `services/menuService.ts` fetches real restaurants from Supabase. These two sources of truth coexist without a clear boundary.

### 6. `pages/restaurant/` split
Some restaurant pages live under `pages/restaurant/` (e.g., `DashboardHome`, `RestaurantLayout`) while `MenuManagement.tsx` lives at the root of `pages/`. This is inconsistent.

### 7. `SettingsContext` uses hardcoded defaults
`src/contexts/SettingsContext.tsx` has hardcoded user data (`"Jamie Doe"`, `"jamie@bite.app"`) and persists to `localStorage`, but is not connected to the Supabase `profiles` table.

---

## Refactoring Plan

### Phase 1 — Remove mock/prototype code (High priority)

**Step 1.1 — Fix `Login.tsx` auth flow**
Replace the `setTimeout` + `setAppUser(true)` fake login with real Supabase `signIn` / `signUp` calls from `useAuth()`. Same for social login stubs.

**Step 1.2 — Fix `QREntry.tsx`**
Remove the `mockData` import and `startSession(tableNum)` stub. Wire it to the real `TableSessionContext` flow (which already reads from Supabase via URL params in `JoinTable.tsx`).

**Step 1.3 — Audit all `setTimeout` + `navigate` patterns**
Search for other pages doing fake async flows and replace with real ones or remove entirely.

---

### Phase 2 — Eliminate `AppUserContext` (High priority)

**Step 2.1 — Audit all `useAppUser()` consumers**
Find every component calling `useAppUser()` and determine what it actually needs (`isAppUser` flag, user name, etc.).

**Step 2.2 — Migrate to `useAuth()`**
Replace `isAppUser` checks with `isAuthenticated` from `AuthContext`. The hardcoded user object (`"Jamie D."`, `"user-1"`) should come from `auth.profile`.

**Step 2.3 — Delete `AppUserContext.tsx`**
Remove the file and its import/usage in `App.tsx`.

---

### Phase 3 — Extract inline hooks from pages (Medium priority)

**Step 3.1 — Move `useDefaultRestaurant` and `useRestaurantById` from `Menu.tsx`**
Move them into `hooks/useMenu.ts` alongside the existing `useMenuCategories` / `useMenuDishes` hooks.

---

### Phase 4 — Compose provider tree (Medium priority)

**Step 4.1 — Create `src/providers/AppProviders.tsx`**
Wrap all context providers into a single component, then replace the nested pyramid in `App.tsx` with `<AppProviders>`.

---

### Phase 5 — File organization (Low priority)

**Step 5.1 — Move `pages/MenuManagement.tsx` → `pages/restaurant/MenuManagement.tsx`**
Update the import in `App.tsx` accordingly.

---

### Phase 6 — Connect `SettingsContext` to Supabase (Low priority)

**Step 6.1 — Load/save settings from `profiles` table**
Replace the hardcoded defaults and `localStorage` persistence with Supabase reads/writes tied to `useAuth().user`.

---

### Phase 7 — Consolidate static vs. live restaurant data (Low priority)

**Step 7.1 — Decide on one source of truth**
Either migrate `Explore.tsx` to fetch restaurants from Supabase (and delete `data/restaurants.ts`), or keep static data intentionally and document why. The current silent coexistence of both is the problem.

---

## Suggested Execution Order

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7
```

Phases 1 and 2 unblock the rest — once mock auth is removed and `AppUserContext` is eliminated, the codebase is in a much cleaner state to tackle the structural changes in Phases 3–7.
