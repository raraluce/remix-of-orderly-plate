

# Stitch Redesign — Full App Unification Plan

This plan restructures the entire app's UI and screen flow to match the Google Stitch designs, updating global design tokens so every component picks up the new look.

**Note:** I couldn't extract `stitch_bite..zip` in plan mode (zips can't be unpacked here). Please drag the screens directly into the next chat message as PNG/JPG. Implementation will use those images as the visual source of truth — what's below is the structural framework that will hold them.

---

## 1. Global design tokens (foundation — done first)

Rewrite `src/index.css` and `tailwind.config.ts` so every existing component automatically inherits the new look:

- **Color palette** — replace HSL variables under `:root` and `.light` (background, foreground, primary, accent, secondary, muted, border, ring, destructive, sidebar tokens) with Stitch palette
- **Typography** — swap Google Font imports and update `fontFamily.display` / `fontFamily.body`
- **Radii** — adjust `--radius` and the Tailwind `borderRadius` scale
- **Gradients & effects** — update `.gradient-accent`, `.text-gradient`, `.glass`, `.glow-accent` utilities to match Stitch's accent treatment
- **Motion** — align `.hover-lift` and animation tokens

Because shadcn components and existing pages all consume these tokens, ~70% of the visual update propagates automatically.

## 2. Shared layout primitives

- **Mobile shell** (`BottomNav`) — restyle bar, icons, active indicator to Stitch nav pattern
- **Manager shell** (`RestaurantLayout` sidebar) — restyle nav items, collapsed state, header
- **Page headers** — standardise sticky header pattern (back button, title, action) used across `Menu`, `TableView`, `OrderStatus`, `Payment`, etc.
- **Cards & sheets** — align `Card`, `Sheet`, `Dialog`, `Drawer` to Stitch corner radius, padding, elevation

## 3. Diner / QR ordering surfaces

| Page | Redesign focus |
|---|---|
| `JoinTable` | Welcome card, table number hero, name input |
| `Menu` | Search bar, category nav strip, dish grid, personalised mode badges |
| `SupabaseMenuCard` | New card composition (image ratio, badge style, price, Add CTA) |
| `CartSheet` | Item rows, customise/edit, totals breakdown, CTA |
| `CustomiseSheet` | Ingredient toggles, cooking-point selector, price preview |
| `FloatingCart` | Repositioned/restyled FAB |
| `TableView` | Guests list, order status card, summary |
| `OrderStatus` | Live status timeline (Received → Preparing → Ready) |
| `Payment` | Summary, discount, tip, split mode, pay CTA |
| `OrderConfirmation` | Success hero, order recap, next actions |
| `Feedback` | Star/emoji rating, comment, submit |

## 4. App user / discovery surfaces

| Page | Redesign focus |
|---|---|
| `Index` (landing) | Hero, value props, CTAs |
| `Register` / `Login` / `ForgotPassword` | Auth card, social/email buttons, 5-step flow |
| `Explore` / `SmartExplore` | Restaurant cards, filters, smart questionnaire wizard |
| `MapView` | Map + bottom sheet card peek |
| `RestaurantView` | Hero, info, menu preview, reserve CTA |
| `DinerProfile` / `ProfileSettings` | Avatar, preferences, dietary, payment methods |

## 5. Restaurant manager surfaces

| Page | Redesign focus |
|---|---|
| `DashboardHome` | KPI cards, charts, recent orders |
| `OrdersManagement` | Status filter, order cards, advance action |
| `MenuManagement` + `DishFormSheet` | Dish list, add/edit form |
| `TablesQR` | Table grid, QR preview, live participants |
| `PaymentsView` | Revenue stats, transactions list |
| `AnalyticsDashboard` | Charts, insights |
| `RestaurantSettings` | Branding, hours, payment model, AI toggles |

## 6. Screen flow adjustments

Audit and align navigation transitions so they match Stitch's intended flow:

- Landing → Register/Login → Explore (app user) **or** QR scan → Join → Menu (diner)
- Menu → Cart → (Pay Now branch: Payment → Confirmation) **or** (Pay Later branch: Order Status → Table View → Payment)
- Manager: Login → Dashboard → drill-down per nav item

Any screens where Stitch shows a different transition (e.g., bottom-sheet vs full page) will be migrated to the matching pattern.

## 7. QA pass

- Visual check at mobile (375px), tablet (768px), desktop (1280px)
- Verify dark/light token parity
- Confirm bottom-nav padding (`pb-20`) preserved on all full-screen overlays per project rule
- Confirm allergen/diet checkboxes still default unchecked (food safety rule)

---

## Execution order

1. Apply global tokens (`index.css`, `tailwind.config.ts`) — instant app-wide refresh
2. Restyle shared shells (`BottomNav`, `RestaurantLayout`, page headers)
3. Diner flow pages in user-journey order
4. App user / discovery pages
5. Manager dashboard pages
6. Cross-device QA

## Technical notes

- No backend/schema changes — pure UI/UX work
- Existing Supabase wiring (sessions, orders, payments, realtime) preserved
- Keep all current routes in `App.tsx`; only the rendered UI changes
- shadcn components edited in place rather than replaced, so prop APIs stay stable
- Memory rules respected: bottom-nav padding, image placeholders for missing dish images, EU-14 allergen defaults

## What I need from you next

Please drop the Stitch screens into the next message as image files (PNG/JPG). Once I can see them, I'll execute the plan above using those visuals as the source of truth — starting with global tokens so the whole app shifts in one pass, then refining each page.

