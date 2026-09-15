# ( parentesi )

Portfolio website for ( parentesi ), a Berlin-based itinerant food project by Italian chef Pietro Platania: plant-based fine dining, supper-club events, tailor-made catering, cooking workshops, and food consulting. The name means *parenthesis* — a suspended moment — and `( )` is the logo and core graphic motif. The sibling music project is **Planatia** (Pietro's music alias — this is not a typo of "Platania"): soundcloud.com/planatia, instagram.com/planatia.

## Stack

- SvelteKit 2 + Svelte 5 (runes), TypeScript
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- Vercel adapter (`@sveltejs/adapter-vercel`)
- Vitest (browser mode via Playwright) for tests
- `npm run dev` / `build` / `check` / `lint` / `format` / `test`

## Design concept

Full brief in [docs/design-prompt.md](docs/design-prompt.md) — read it before touching UI. Key decisions (agreed with the site owner):

- **No long scrolling pages.** Each route is a single full-screen stage: 3–6 full-bleed photos crossfade endlessly (8–12s cycles) behind fixed, always-readable text. Scroll/swipe input doesn't move the page — it accelerates the crossfade.
- **Nav is the logo:** a `( )` mark acts as the hamburger; opening it spreads the parentheses to reveal `( food  music  contact )`. The mark returns home.
- **Routes:** `/` (home), `/food`, `/music`, `/contact`. Music is a deliberate teaser page (darker treatment), not a full section.
- **Identity:** evolution of the brochure (`static/Brochure Example.pdf`) — beige/ecru (~#D6CFAF), near-black ink, typewriter voice (`static/font/Typo.ttf`), generous whitespace, `( )` as punctuation-as-logo. No cards, drop shadows, decorative gradients, or bouncy motion.
- Must work well on mobile (390px) and desktop.

## Assets (`static/`)

- `Brochure Example.pdf` — existing brand document; reference, not template.
- `photos/` — three families: moody candlelit event series (files prefixed `( )`, by Fredericke Alma Sauerbrey), daylight plating series (`3H6A*.jpg`), documentary series (`parentesi_240327_* © Zoe Spawton_Large.jpg`). Photo credits (Sauerbrey, Spawton) must appear on the site. Two `IMG_*.HEIC` files need conversion before web use. Filenames contain spaces/parentheses/`©` — URL-encode when referencing.
- `font/Typo.ttf` — brand typewriter face.
- `text/Text website parentesi update.pages` — source copy (already transcribed into the design prompt).

## Content facts

- Contact: parentesi.berlin@gmail.com · +39 340 873 2532
- Manifesto and services list: see docs/design-prompt.md (Home section) — use that wording verbatim.
- Pietro's CV highlights: Le Cordon Bleu Paris; Le Bristol***; Il Luogo di Aimo e Nadia**; Joia*; Vun**; Chez Panisse; founder of Banco Natural Food, Rome; now Berlin.
