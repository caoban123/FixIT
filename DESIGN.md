# FixIT Student — design and presentation notes

## Concept

**A student tech studio: capable, approachable, and made for campus life.**

The homepage turns the service journey into a story: a familiar laptop problem,
a way to find the right fix, clear prices, a semester bundle, and a simple booking
process. Vietnamese is the primary language; short English labels add a studio
identity without replacing the main instructions.

## Visual decisions

- Soft silver backgrounds and dark ink make the page feel welcoming. Violet is the
  main action color; pale lavender and a restrained lime accent distinguish the
  diagnostic and Student Pack sections.
- Large headings, asymmetric composition, and a hand-drawn headline loop give
  the homepage a recognizable identity.
- The laptop is an original HTML/CSS illustration. Service thumbnails are local
  SVG illustrations with consistent geometry and colors for each service type.
  Existing tutorial videos and their poster images remain on the detail pages.
- The same buttons, cards, navigation, and form surfaces carry through the other
  pages. Dark mode uses separate surface and text tokens.
- Short entrance transitions, pointer highlights, and gently floating artwork
  support the layout. Continuous effects pause outside the viewport and when
  the tab is hidden. Reduced-motion settings are respected, including when
  changed while the page is open. No animation framework, remote font, or
  stock-image dependency was added.

## Implementation

| File | Purpose |
| --- | --- |
| `layouts/partials/studio-home.html` | Homepage sections and data-driven prices |
| `layouts/partials/service-art.html` | Original decorative service illustrations |
| `static/css/studio.css` | Theme tokens, shared polish, responsive homepage |
| `static/js/studio.js` | Homepage category filters and result count |
| `layouts/partials/studio-{services,fix,pack,about,contact}.html` | Purpose-built inner page layouts |
| `static/css/studio-pages.css` | Inner page artwork, layouts, and responsive styles |
| `layouts/partials/studio-service-detail.html` | Illustrated service pages, videos, inclusions, and booking |
| `layouts/partials/studio-cart.html` | Empty cart, booking form, payment preview, and confirmation ticket |
| `layouts/partials/studio-track.html` | Order lookup and the simulated progress timeline |
| `static/css/studio-flow.css` | Diagnosis refinements and the complete booking journey |
| `static/css/effects.css`, `static/js/effects.js` | Optional motion, hover highlights, and booking celebration |
| `static/css/soft-ui.css` | System typography, translucent toolbars, soft controls, and subtle shadows |

The homepage reads prices, service counts, package contents, and savings from the
existing Hugo content. Cart behavior, diagnosis rules, and simulated booking use
the existing shared scripts. Filters use native buttons and expose their selected
state through `aria-pressed`; the result count has a live announcement region.
Decorative artwork is hidden from assistive technology, while service titles
remain ordinary links.

The Services page combines category, price, text search, and sorting. Text search
accepts Vietnamese queries with or without accents. Find Your Fix keeps its
existing decision tree and synchronizes a visible three-stage progress panel.
The Student Pack page calculates its comparison, savings, and included services
from content. About uses the supplied team photographs, names, and roles without
showing placeholder biographies. Contact retains the simulated form and adds
campus shortcuts that select and focus the corresponding location field. On
phones, the form appears before the longer contact details.

Individual service pages use the same illustration system and keep the existing
tutorial videos, service information, and clearly labeled sample feedback. The
diagnosis tool presents illustrated categories, selected-answer chips, and an
illustrated recommendation. Cart items reuse those illustrations with separate
SVG IDs so hidden empty-cart suggestions cannot interfere with their rendering.

The booking journey includes live totals, two demo discount codes, native radio
buttons for payment choices, a simulated QR preview, and a ticket with the order
code, selected appointment window, service count, and total. Users can copy the
ticket code and follow it into the matching tracking page. Validation messages
clear when corrected; progress indicators expose the current step. Cash and QR
flows remain simulations, with the explanation visible in the checkout.

## References

- [Linear: A calmer interface for a product in motion](https://linear.app/now/behind-the-latest-design-refresh)
  — hierarchy and reducing competition between supporting controls and content.
- [Stripe: Connect, behind the front-end experience](https://stripe.com/blog/connect-front-end-experience)
  — using original product illustrations to explain a service visually.

These references informed the design principles. The homepage composition,
laptop illustration, service SVGs, and implementation were created for FixIT.

## Suggested coursework demonstration

1. Explain the campus audience and show how the headline, pricing, and trust
   information address its needs.
2. Show the four featured homepage services, then search or filter all eight in the catalogue and add one to the cart.
3. Use Find Your Fix to reach a recommended service.
4. Show the Student Pack and explain how its savings are calculated from content.
5. Demonstrate the simulated booking flow and order tracking.
6. Switch themes and show the responsive phone layout.

The footer and checkout continue to identify the project as coursework and the
payment flow as a simulation. Personal biographies and real contact information
should be supplied by the team before presenting the project as a live service.

## Readability and booking refinement

Functional body text uses 15–16px, supporting text 13–14px, and form inputs
16px with a minimum height of 48px. Main actions have at least 44px touch
targets. The catalogue and cart use compact introductions; service cards have
Vietnamese explanations and consistent detail/add actions. On phones, selected
services and the booking form precede the secondary receipt, while the payable
total appears beside the final action and updates with discounts.

Demo appointments include a date, campus or remote location, and a time window.
Past dates and Sundays are rejected; weekday and Saturday windows follow the
configured support hours. The ticket and tracking page retain these fields.

Student Pack usage limits, device count, expiry dates, separate-day use, and Git
session duration remain explicitly unconfirmed in data/pack_terms.yaml. Actual
email, Zalo URL, and technical team assignments also need the team's input.
No contact details or professional credentials have been invented.
