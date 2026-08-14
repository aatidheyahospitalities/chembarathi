# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for Chembarathi Wayanad (a resort). Next.js 16 App Router + React 19, TypeScript, Tailwind CSS v4, content from Contentful via GraphQL. Deployed on Netlify (`netlify.toml`).

## Commands

```bash
npm run dev          # dev server (Turbopack) on :3000
npm run build        # production build
npm run start        # serve production build
npm run lint         # eslint (flat config, next core-web-vitals + typescript)
npm run format       # prettier --write .
npm run format:check # prettier --check .
```

No test suite exists in this repo.

Requires `.env.local` (gitignored) with — note the doubled `L`, this spelling is load-bearing:

```
CONTENTFULL_SPACE_ID=...
CONTENTFULL_ACCESS_TOKEN=...
```

## Content architecture (Contentful)

All page content is fetched server-side at build/ISR time. There is no client-side content fetching.

- `app/API/Contentful/getContent.ts` — the single `contentfulFetch<T>()` helper. Posts to the Contentful GraphQL endpoint, calls `notFound()` on a non-OK response, and returns `json.data` typed as `T`.
- `app/API/Query/query.ts` — every GraphQL query lives here as a `{ query, variables }` object, each pinned to a Contentful entry `slug` (`home-page`, `about-page`, `policypage`, plus separate metadata entries `homepage` / `aboutpage` / `policypage`).
- `app/lib/type.ts` — the response types. Naming convention: `*Type` for entry shapes, `*Collection` for the GraphQL envelope (`{ someCollection: { items: T[] } }`).

Each page is an async Server Component that: exports `revalidate = 600`, defines `generateMetadata()` fetching a metadata query, then fetches its content query and destructures `items[0]`. Adding a new CMS-backed page means adding a query + types + a page following that same shape.

Contentful images come from `images.ctfassets.net`, whitelisted in `next.config.ts` `images.remotePatterns`.

### ValueSection variant dispatch

`app/components/valuesection/ValueSection.tsx` is the reusable content-block renderer. Contentful supplies a `contentTypeStyle` field (`TYPE1`–`TYPE4`, defaulting to `TYPE1`); the component normalizes the fields into a flat `ValueSection` object and looks the layout up in `valueSectionComponentMap` (`variants/variants.ts`). To add a layout: add the literal to `ValueSectionVariant` in `valuesection/type.ts`, write the variant component, register it in the map — no changes to callers or pages.

## Scroll system

This is the most cross-cutting piece of the codebase and easy to break.

- `app/components/SmoothScroll.tsx` wraps all page content in `#smooth-wrapper` > `#smooth-content` and creates a GSAP `ScrollSmoother` **only at ≥1024px** (via `gsap.matchMedia`). GSAP is dynamically imported so it never ships to mobile. Below 1024px, native scrolling is used and `globals.css` reverts the wrapper to `height: auto; overflow: visible`.
- Because of this split, never call `window.scrollTo` / `scrollIntoView` directly. Use `scrollToTop()` and `scrollToElement()` from `app/lib/scroll.ts` — they check for a live `ScrollSmoother` instance and fall back to native scrolling.
- `RouteScrollManager` (mounted in the root layout) resets scroll on pathname change.
- `Header` tracks the active nav section with an `IntersectionObserver` over the `id`s in its `navItems` array; homepage sections in `app/page.tsx` carry the matching `id` + `scrollMarginTop`. Keep those two lists in sync.

## Styling

Tailwind v4 with a JS config bridged in via `@config "../tailwind.config.js"` from `styles/globals.css`. PostCSS uses `@tailwindcss/postcss`; there is no `@tailwind` directive — `globals.css` imports `tailwindcss`, `tailwindcss/preflight`, and declares `@source` roots.

- **Breakpoints are max-width (desktop-first), not Tailwind's defaults.** `xs` = `max-width: 540px`, `sm` = `≤640px`, `md` = `≤768px`, `lg` = `≤1024px`, etc. So `xs:!flex-col` means "stack on small phones", the inverse of stock Tailwind. Defined in `tailwind.config.js` `theme.extend.screens`.
- Design tokens are CSS custom properties in `styles/globals.css` (`--typography-*`, `--spacing-padding-*`, `--colors-*`) and are mapped into Tailwind scales in `tailwind.config.js`. Prefer token classes (`text-h2`, `p-4x`, `text-secondary-800`) or arbitrary-value token refs (`gap-(--spacing-padding-16x)`) over raw pixel values.
- Typography classes (`.text-display`, `.text-heading-2`, `.text-xl-regular`, …) are defined **twice**: as a Tailwind plugin in `tailwind.config.js` and as `!important` rules in `styles/typography.css`. Because of the `!important`, overriding them inline requires `!` (e.g. `xs:!text-heading-4`). Edit both places when changing a typography class.
- shadcn/ui is configured (`components.json`, new-york style, lucide icons) with `components/ui/` and `lib/utils.ts` (`cn()`). Only `accordion` is installed so far. Note that most app code lives under `app/components/` — `components/` is reserved for shadcn primitives.
- MUI (`@mui/material`, `@mui/icons-material`) is used only for icons; imports are tree-shaken via `experimental.optimizePackageImports`.

## Conventions

- Path alias `@/*` maps to the repo root, so `@/app/...`, `@/styles/...`, `@/lib/utils`.
- Prettier: single quotes, semicolons, 80 cols, `arrowParens: avoid`, LF endings. Formatting is not enforced by ESLint — run `npm run format` before committing.
- Below-the-fold homepage components are `next/dynamic` imports in `app/page.tsx`; keep that pattern for anything heavy or animation-driven.
- Some content is hardcoded rather than CMS-driven: room/suite data in `DestinationSlider.tsx`, testimonials in `ReviewSection.tsx`, nav items in `Header.tsx`, and the WhatsApp number in `app/Services/openWhatsApp.ts`.
- Policy page anchors are derived from Contentful section names by `createPolicySectionId()` in `app/policy/utils.ts`; `POLICY_FOOTER_SECTION_NAMES` maps footer link labels to those CMS section names — renaming a section in Contentful breaks the footer deep links unless that map is updated.
