# FixIT Student — Comprehensive Redesign Plan & Specification

## 1. Project Architecture & Audit (PHASE 0)

### 1.1 Tech Stack & Build Tooling
* **Static Site Generator:** Hugo (v0.120+ compatible, currently running via `hugo server` on `localhost:1313`).
* **Frontend Architecture:** Vanilla HTML5 templates (`layouts/`), Vanilla CSS (`static/css/main.css`), Vanilla JavaScript (`static/js/` without external heavyweight JS libraries).
* **Typography:** `Be Vietnam Pro` (display/headings, full Vietnamese diacritics support) + `Plus Jakarta Sans` (body text) + `JetBrains Mono` (code/tickets/monospaced numbers).
* **Data Sources:** Hugo content files (`content/services/`, `content/posts/`), data files (`data/fixes.json`), and site configuration (`hugo.toml`).
* **Output Formats:** HTML pages + `services.json` generated on the homepage for client-side search, cart, and wizard consumption.

### 1.2 Existing Routes & Responsibilities
| Route | Type | Responsibility |
|---|---|---|
| `/` | Homepage | Value proposition, quick service discovery, problem categories, student pack highlight, workflow explanation, FAQ preview. |
| `/services/` | Catalog | 8 fixed-price student IT services with real-time category filtering, live search, and detail modal/links. |
| `/find-your-fix/` | Diagnostic Wizard | 3-step interactive troubleshooting wizard mapping student symptoms to exact services. |
| `/student-pack/` | Bundle Presentation | 6-in-1 combo package (149.000đ) showcasing savings, features, student benefits, and quick-add CTA. |
| `/about/` | Story & Team | Student team background (ĐH KHTN ĐHQG-HCM), project mission, customer workflow, and campus presence. |
| `/contact/` | Contact & Booking | Campus support hubs (CS1 Nguyễn Văn Cừ & CS2 Thủ Đức), Zalo channel, and consultation booking form with demo ticket generator. |
| `/cart/` | Shopping Cart & Checkout | Service review, stepper qty control, coupon validation, campus meeting time/place selector, and simulated VietQR/MoMo payment. |
| `/track/` | Order Tracker | Lookup simulated order status by ticket ID (e.g., `FIXIT-REQ89`). |
| `/faq/` | Knowledge Base | Frequently asked questions regarding pricing, warranty, security, and turnaround time. |

### 1.3 Audit Findings & Identified Inconsistencies
* **Color & Contrast:** Previously lacked a cohesive token scale; light mode had several hardcoded dark backgrounds and low-contrast text.
* **Component Primitives:** Button variants, inputs, badges, and cards need unified design tokens (`--bg`, `--surface`, `--accent`, `--ink`, `--line`, `--radius`).
* **Navbar & Header:** Needed refined sticky island layout, accessible keyboard navigation (`:focus-visible`), aria attributes, and mobile drawer transitions.
* **Footer:** Lacked structured column layout and proper light mode variables.
* **Accessibility:** Needed clear focus-visible rings, skip links, semantic landmarks, and `prefers-reduced-motion` compliance.

---

## 2. Global Design System (PHASE 1 Specification)

### 2.1 Design Tokens

#### Dark Mode (Default)
* `--bg`: `#080B12` (deep cyber midnight)
* `--surface`: `#111827` (card base)
* `--surface-elevated`: `#151E2A` (elevated dropdowns, modals, floating bar)
* `--surface-hover`: `#1E293B`
* `--accent`: `#10B981` (emerald green)
* `--accent-hover`: `#059669`
* `--accent-soft`: `rgba(16, 185, 129, 0.12)`
* `--accent-glow`: `rgba(16, 185, 129, 0.35)`
* `--secondary-accent`: `#06B6D4` (cyan)
* `--ink`: `#F8FAFC` (high contrast white)
* `--ink-secondary`: `#CBD5E1` (soft reading text)
* `--muted`: `#94A3B8` (subtle captions, helper text)
* `--line`: `rgba(255, 255, 255, 0.08)` (subtle divider)
* `--line-hover`: `rgba(16, 185, 129, 0.4)`
* `--warn`: `#FBBF24` / `--warn-bg`: `rgba(251, 191, 36, 0.12)`

#### Light Mode (`:root[data-theme="light"]`)
* `--bg`: `#F8FAFC` (clean crisp slate)
* `--surface`: `#FFFFFF` (card base)
* `--surface-elevated`: `#FFFFFF`
* `--surface-hover`: `#F1F5F9`
* `--accent`: `#059669` (high-contrast deep emerald)
* `--accent-hover`: `#047857`
* `--accent-soft`: `#D1FAE5`
* `--accent-glow`: `rgba(5, 150, 105, 0.2)`
* `--secondary-accent`: `#0284C7` (deep cyan)
* `--ink`: `#0F172A` (deep dark slate)
* `--ink-secondary`: `#334155`
* `--muted`: `#64748B`
* `--line`: `#E2E8F0`
* `--line-hover`: `#059669`
* `--warn`: `#B45309` / `--warn-bg`: `#FEF3C7`

### 2.2 Typography Scale
* Font Display: `'Be Vietnam Pro', system-ui, -apple-system, sans-serif`
* Font Body: `'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`
* Font Mono: `'JetBrains Mono', monospace`
* Scale:
  * Display / Hero: `clamp(2.2rem, 4vw, 3.2rem)`, weight 900, tracking `-0.025em`
  * H1: `clamp(1.8rem, 3.2vw, 2.4rem)`, weight 800
  * H2: `clamp(1.4rem, 2.5vw, 1.8rem)`, weight 800
  * H3: `1.2rem`, weight 700
  * Body: `1rem` (16px), line-height `1.65`
  * Small: `0.875rem` (14px)
  * Tiny: `0.75rem` (12px)

### 2.3 Component Primitives
* **Buttons:**
  * `.btn-primary` / `.btn-glow-pill`: High-emphasis pill with subtle gradient and hover glow.
  * `.btn-secondary` / `.btn-glass-pill`: Glass/outline pill for secondary actions.
  * `.btn-ghost`: Borderless button with hover tint.
* **Cards:**
  * `.card`: Rounded (`--radius: 18px`), backdrop-filter blur, subtle border.
* **Header & Navbar:**
  * Sticky floating pill (`.header-inner`) with `backdrop-filter: blur(20px)`.
  * Active link indicator with rounded pill background.
  * Accessible theme toggle with SVG/icon indicator.
  * Cart badge reflecting real-time item count.
  * Mobile responsive toggle (`aria-expanded`, drawer menu).
* **Footer:**
  * 3-column layout (Brand & Slogan, Explore Links, Contact & Campus Points).
  * Prominent educational project disclaimer (`Đồ án 1 – CSC00006`).
* **Accessibility:**
  * `:focus-visible` outline in `--accent` for all interactive elements.
  * Skip-to-content link `.skip` at the top of the body.
  * Respect `prefers-reduced-motion: reduce`.

---

## 3. Phase Implementation Checklist

- [x] **PHASE 0:** Repository audit & design specification.
- [x] **PHASE 1:** Global Design System, Typography, Layout, Buttons, Navbar, and Footer.
- [x] **PHASE 2:** Homepage redesign (Hero 3D Ball, Feature stack, Problem cards, Pipeline flow, Student Pack spotlight, FAQ preview accordion, Conversion CTA banner).
- [x] **PHASE 3:** Services catalog & service cards (Live filter, Category chips, Sort/Price selects, Service cards, Detail pages & Combo banner).
- [x] **PHASE 4:** Find Your Fix diagnostic wizard (3-step decision tree, Result recommendations, Total calc, Add all to cart & 30s Health check quiz).
- [x] **PHASE 5:** Student Pack bundle presentation (Hero packaging banner, 6-in-1 in-pack services showcase, Cost comparison table, Add-to-cart integration, Dark & Light mode contrast).
- [x] **PHASE 7:** About page, interactions, accessibility & QA (5-member team layout, AI usage disclosure, scroll reveal with staggered observer, reduced-motion compliance, skip-to-content accessibility, and cross-page end-to-end testing).
