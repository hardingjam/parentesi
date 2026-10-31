# ( parentesi )

Portfolio website for ( parentesi ), a Berlin-based itinerant food project by Italian chef Pietro Platania: plant-based fine dining, pop-up dinners, tailor-made catering, cooking workshops, and food consulting. The name means _parenthesis_ — a suspended moment — and `( )` is the logo and core graphic motif. The sibling music project is **Planatia** (Pietro's music alias — this is not a typo of "Platania"): soundcloud.com/planatia, instagram.com/planatia.

## Stack

- SvelteKit 2 + Svelte 5 (runes), TypeScript
- Plain CSS: scoped component styles + shared tokens/reset in `src/routes/layout.css` (no Tailwind)
- Vercel adapter (`@sveltejs/adapter-vercel`)
- Vitest (browser mode via Playwright) for tests
- `npm run dev` / `build` / `check` / `lint` / `format` / `test`

## Design concept

Full brief in [docs/design-prompt.md](docs/design-prompt.md) — read it before touching UI. Key decisions (agreed with the site owner):

- **One long scrolling page** (owner decision 2026-10-31, superseding the earlier one-stage-per-route design). Full-screen sections scroll over ONE fixed photo reel that crossfades continuously (5s display + 1s dissolve per photo); the section in view (scroll spy) switches the reel's photo group and scrim/filter, except during a nav glide: the nav names the destination at once, the reel holds until arrival, and breaking off the glide falls back to the section in view. Scrolling never changes the reel's pace (owner decision 2026-09-15), and opening the nav blurs but doesn't darken the photos.
- **Nav is the logo:** the `( )` mark acts as the hamburger and always names the section in view, e.g. `( food )`; opening it spreads the parentheses to reveal `( home  food  music  contact )`. The parens return home. Desktop: top-left, horizontal. Phones/tablets (≤1023px): top-left and vertical; closed it's just the parens on their side (︵ ︶), opening downward into a stacked list at the h2 size (the current section highlighted). Opening blurs the page behind (lightly on desktop); it no longer fades the page.
- **Sections (hash routes):** `#home`, `#food`, `#music`, `#contact` on `/`; the fixed nav's links glide to them (slow ease-in-out, `$lib/scroll.ts`; native smooth scrolling can't be slowed). Music is a deliberate teaser (darker treatment).
- **Identity:** evolution of the brochure (`static/Brochure Example.pdf`) — beige/ecru (~#D6CFAF), near-black ink, typewriter voice (`static/font/Typo.ttf`), generous whitespace, `( )` as punctuation-as-logo. No cards, drop shadows, decorative gradients, or bouncy motion.
- Must work well on mobile (390px) and desktop.

## Assets (`static/`)

- `Brochure Example.pdf` — existing brand document; reference, not template.
- `photos/` — three families: moody candlelit event series (files prefixed `( )`, by Fredericke Alma Sauerbrey), daylight plating series (`3H6A*.jpg`), documentary series (`parentesi_240327_* © Zoe Spawton_Large.jpg`). No photo credits on the site (owner decision 2026-10-31). Two `IMG_*.HEIC` files need conversion before web use. Filenames contain spaces/parentheses/`©` — URL-encode when referencing.
- `font/Typo.ttf` — brand typewriter face.
- `text/Text website parentesi update.pages` — source copy (already transcribed into the design prompt).

## Content facts

- Contact: pietroplatania89@gmail.com · +39 340 873 2532 · instagram.com/parentesi.berlin (also used for music bookings; parentesi.berlin@gmail.com is no longer on the site)
- Manifesto and services list: see docs/design-prompt.md (Home section) — use that wording verbatim.
- Pietro's CV highlights: Le Cordon Bleu Paris; Le Bristol***; Il Luogo di Aimo e Nadia**; Joia*; Vun**; Chez Panisse; founder of Banco Natural Food, Rome; now Berlin.

## Agent skills

### Issue tracker

GitHub Issues on hardingjam/parentesi, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root, created lazily. See `docs/agents/domain.md`.
