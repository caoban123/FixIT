# MASTER PROMPT — FIXIT STUDENT PREMIUM E-COMMERCE REDESIGN

## Role

You are a Senior Product Designer, UI/UX Engineer, Frontend Architect, and E-commerce Conversion Specialist.

Your task is to redesign and improve the existing **FixIT Student** website into a polished, production-quality, modern service-commerce experience for Vietnamese IT students.

The result should feel like a professionally designed technology startup website rather than a generic student assignment or AI-generated template.

Use the design quality, attention to detail, typography, spacing, and interaction principles found in modern products such as Linear, Stripe, Shopify, and Framer.

These websites are design references, not templates to copy.

## Project Context

FixIT Student is a Vietnamese website offering affordable technical support services for students.

Its current information architecture includes:

- Home
- Services: 8 fixed-price services covering common IT issues
- Find Your Fix: a 3-step problem diagnosis wizard
- Student Pack: a bundle of 6 services advertised at 149,000 VND
- About
- Contact and support booking
- Shopping Cart / Demo Checkout

The current brand is based on a dark background, green/mint accents, rounded cards, and developer-oriented visual elements.

The website is currently a student project demonstration. It must never misrepresent demo payment, AI functionality, operational guarantees, real customers, or support availability.

## Primary Goal

Transform the website into a cohesive, premium service-commerce interface that is:

1. Visually sophisticated and memorable.
2. Trustworthy and easy to understand.
3. Optimized for browsing and booking technical services.
4. Responsive across mobile, tablet, and desktop.
5. Accessible, performant, and maintainable.
6. Consistent in typography, spacing, colors, and component patterns.
7. Beautiful without sacrificing usability.

Do not redesign it as a generic SaaS dashboard.

The product is a service marketplace, so the UI should prioritize service discovery, transparent pricing, customer confidence, and a straightforward booking experience.

## CRITICAL: Inspect Before Modifying

Before writing code:

1. Inspect the entire existing project structure.
2. Identify the frontend framework and styling system.
3. Read package.json or the equivalent project manifest.
4. Inspect routes, components, pages, styles, assets, hooks, and state management.
5. Identify the existing service data source and shopping-cart implementation.
6. Inspect the diagnostic wizard and its recommendation logic.
7. Check the existing responsive behavior.
8. Determine which features are genuine and which are simulated.
9. Check which build, lint, test, and formatting commands are available.
10. Identify reusable components and design inconsistencies.

Do not assume the project uses React, Next.js, Tailwind CSS, or any particular framework.

Preserve the existing framework unless there is a demonstrable technical reason to change it.

Do not install a large UI library just to replace existing lightweight components.

Do not delete existing routes, services, business rules, shopping cart logic, or demo disclaimers.

Do not silently modify prices, package contents, discount calculations, warranty conditions, or contact details.

If existing prices or package totals are inconsistent, report the discrepancy instead of inventing replacement values.

## Working Method: Incremental Development

Implement this redesign in the following phases.

PHASE 0 — Repository audit and design specification  
PHASE 1 — Design system, navigation, footer, and global layout  
PHASE 2 — Homepage redesign  
PHASE 3 — Services catalog and service cards  
PHASE 4 — Find Your Fix diagnostic wizard  
PHASE 5 — Student Pack product presentation  
PHASE 6 — Shopping cart, booking, and contact experience  
PHASE 7 — About page, interactions, accessibility, and final QA

**Important:** In the initial execution, complete PHASE 0 only, produce the audit and implementation plan, and wait for my approval before implementing PHASE 1.

Afterward, complete only the explicitly approved phase.

Do not redesign all pages simultaneously.

For each implemented phase:

- Review the existing implementation.
- Explain the problems being addressed.
- Implement the approved design changes.
- Preserve working functionality.
- Run applicable build, lint, and tests.
- Verify the changed pages visually where browser tooling is available.
- Check desktop and mobile layouts.
- Summarize modified files and design decisions.
- Report any errors, limitations, and unresolved issues.
- Stop and wait for the next phase instruction.

## PHASE 0 — Design Audit & Specification

Create or update `REDESIGN_PLAN.md`.

Include:

- Current project architecture.
- Existing routes and their responsibilities.
- Reusable components.
- Current UI inconsistencies.
- Functional risks.
- Proposed design tokens.
- Proposed component structure.
- Responsive layout strategy.
- Interaction and animation guidelines.
- Phase-by-phase implementation checklist.
- Existing commands for testing and building.
- Accessibility and performance acceptance criteria.

Identify what can be reused and what needs refactoring.

Do not change application behavior in this phase.

## PHASE 1 — Global Design System

Create a cohesive premium dark design system.

Suggested color direction:

- Main background: #080B12
- Surface: #111827
- Elevated surface: #151E2A
- Primary accent: #5DBD91
- Secondary accent: #84DCC6
- Primary text: #F5F7FB
- Secondary text: #95A3B8
- Borders: subtle cool-gray tones

Treat these as starting values, not immutable requirements. Refine them to achieve good contrast and visual harmony.

Use a consistent system of:

- Color tokens.
- Typography scale.
- Spacing tokens.
- Border-radius tokens.
- Shadows and elevation.
- Focus states.
- Button variants.
- Card variants.
- Form controls.
- Container widths.
- Responsive breakpoints.
- Motion timing.

Prefer design tokens and reusable primitives over scattered hardcoded values.

Use modern typography with an appropriate font that supports Vietnamese diacritics.

Consider Geist, Inter, or an existing high-quality font. Avoid adding unnecessary font dependencies.

Improve the navigation:

- Refined sticky header.
- Better spacing and alignment.
- Clear active navigation states.
- Functional cart count.
- Accessible theme toggle if the feature already exists.
- Responsive mobile menu.
- Keyboard and focus support.

Improve the footer:

- Clear navigation.
- Relevant contact information.
- Student-project disclosure.
- Consistent brand identity.
- No fabricated social links or business credentials.

Use subtle borders, premium surfaces, balanced contrast, and restrained decorative gradients.

Avoid excessive glow, blur, floating elements, or overwhelming glassmorphism.

## PHASE 2 — Homepage Redesign

Redesign the homepage around the customer's primary problem:

"I am a student experiencing a technical problem and need help quickly."

Suggested page hierarchy:

1. Compelling hero section.
2. Primary CTA: Explore Services.
3. Secondary CTA: Find Your Fix.
4. Service category shortcuts.
5. Popular service previews, using real project data.
6. How It Works section.
7. Student Pack promotional section.
8. Verified service policies and support information.
9. Contact CTA.
10. Footer.

Example hero direction:

"Fix lỗi IT. Tiết kiệm thời gian."

Supporting copy should clearly explain what the service does, for whom, and how to request assistance.

Avoid generic marketing slogans without concrete meaning.

Design an engaging hero composition using a clean service illustration, a realistic UI mockup, or a carefully composed developer-themed visual.

Do not add decorative imagery that is irrelevant to technical support.

Use animation sparingly: subtle entrance transitions, hover feedback, and responsive interactive elements.

The homepage should establish the product value proposition within the initial viewport.

## PHASE 3 — Services Catalog

Redesign the service listing into a conversion-oriented service-commerce experience.

Requirements:

- Clear service title.
- Service category.
- Short problem-oriented description.
- Prominent price.
- Clear service inclusions.
- Available support method, if known.
- Strong "Xem chi tiết" or "Chọn dịch vụ" CTA.
- Consistent card height and alignment.
- Useful illustrations or category icons.
- Responsive service grid.

Improve searching and filtering.

Use compact category tabs or controls, a clear price filter, and relevant sorting.

Preserve existing search and filter behavior.

Ensure active filters are visible and easy to clear.

Implement useful loading, no-results, and error states if the underlying functionality requires them.

Do not invent ratings, sales counts, stock indicators, popularity labels, or customer reviews.

Consider a dedicated service detail view only if it fits the existing architecture and improves usability.

Do not duplicate service data across multiple files.

## PHASE 4 — Find Your Fix

Redesign the diagnostic wizard as a clear guided troubleshooting journey.

The user should understand:

- What step they are on.
- Why the question is being asked.
- What happens after selecting an option.
- How to go backward.
- How to restart.
- How the final recommendation was generated.

Preserve the existing diagnostic and service recommendation logic.

Improve the visual presentation of options using accessible selection cards.

Use an elegant progress indicator.

Ensure the final result clearly explains:

- The reported problem.
- A possible explanation where supported.
- The recommended service.
- The price.
- The next action.

Do not claim a guaranteed diagnosis.

If the current system uses decision rules rather than actual AI inference, describe it accurately.

Never add fake "AI processing" indicators solely for visual effect.

## PHASE 5 — Student Pack

Redesign the Student Pack section into a premium bundle-product presentation.

Prioritize:

- Bundle title.
- Price of 149,000 VND, subject to the existing data source.
- Six included services.
- Individual service values.
- Accurate savings.
- Bundle benefits.
- Conditions and limitations.
- Clear purchase CTA.

Calculate discounts using the existing source-of-truth prices.

Do not hardcode contradictory amounts.

Use a clean, premium promotional composition rather than an oversized decorative gift graphic.

The customer should understand the offer without extensive scrolling.

Clearly differentiate bundle purchase from individual service selection.

## PHASE 6 — Cart, Booking, Contact

Treat booking as the critical conversion flow.

Improve:

- Cart item presentation.
- Service summaries.
- Price visibility.
- Remove item interactions.
- Empty cart design.
- Order summary.
- Contact form layout.
- Support location or online method selection.
- Error validation and helpful feedback.
- Confirmation states.

Use a logical journey:

Select Service → Review Selection → Enter Contact Information → Choose Support Method → Review Request → Demo Confirmation.

Reuse existing booking logic wherever possible.

Do not invent real payment processing.

Keep explicit demo disclosures where payment or order fulfillment is simulated.

Avoid collecting unnecessary sensitive information.

Provide a straightforward route to booking a single service without forcing users to navigate through a complicated cart.

Preserve cart state correctly and prevent accidental loss of selections.

## PHASE 7 — About, Motion, Accessibility & QA

Redesign the About page with:

- Concise project story.
- Genuine student-team information.
- Verified project context.
- Clear explanation of service purpose.
- A simple customer support workflow.
- Relevant contact CTA.

Avoid overlong paragraphs and generic promotional claims.

Apply consistent interactions throughout the website:

- Subtle card hover elevation.
- Button pressed states.
- Smooth but short transitions.
- Proper accordion animations.
- Nonintrusive feedback states.
- Reduced-motion support.

Respect `prefers-reduced-motion`.

Do not add animation libraries unless the existing stack genuinely needs them.

Accessibility requirements:

- Keyboard navigation.
- Visible focus states.
- Semantic landmarks and headings.
- Proper form labels.
- Meaningful accessible names.
- Adequate contrast.
- Touch targets appropriate for mobile.
- No information conveyed by color alone.

Performance requirements:

- Avoid unnecessary client-side dependencies.
- Optimize images and icons.
- Minimize layout shifts.
- Avoid excessive animation work.
- Maintain reasonable bundle size.
- Use lazy loading appropriately.

## Responsive Standards

Test at representative viewport widths:

- 375px mobile.
- 768px tablet.
- 1280px desktop.
- 1440px desktop.

Check for horizontal overflow, broken navigation, clipped headings, misaligned cards, unusable forms, and excessively large blank spaces.

Ensure the primary service CTA remains visible and usable on mobile.

Use real content lengths, including Vietnamese text, to validate the layout.

## Visual Quality Standards

The finished interface should feel:

- Premium but student-friendly.
- Technically credible.
- Minimal but not empty.
- Professional but not corporate.
- Modern without relying on design gimmicks.
- Consistent across all pages.

Avoid:

- Generic dashboard aesthetics.
- Emoji-heavy commercial UI.
- Excessive gradients and glowing borders.
- Oversized illustrations that hide purchase information.
- Huge empty sections without purpose.
- Multiple competing CTAs.
- Inconsistent card sizing.
- Fake testimonials.
- Fabricated metrics.
- Unnecessary complexity.

## Definition of Done

A phase is complete only when:

1. The approved UI changes are implemented.
2. Existing functions still work.
3. Build and available checks pass, or blockers are reported.
4. Responsive behavior has been inspected.
5. There are no obvious accessibility regressions.
6. No business data or policies were unintentionally changed.
7. All changed files are documented.
8. Remaining risks are clearly identified.

Never claim successful testing if tests were not executed.

## First Task

Start by inspecting the repository.

Complete PHASE 0 only.

Produce `REDESIGN_PLAN.md` with an actionable design and implementation plan tailored to the actual codebase.

Then summarize the audit and wait for my approval before writing UI implementation code.