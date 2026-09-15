# Handoff: ( parentesi ) website

## Overview
Four-route portfolio site for ( parentesi ), Pietro Platania's Berlin-based itinerant plant-based food project. Routes: `/` (home), `/food`, `/music`, `/contact`. Each route is a single full-screen stage: photos crossfade endlessly behind fixed text; nothing scrolls except the Food text frame on mobile. Navigation is the `( )` logo mark itself.

Target codebase: the existing SvelteKit 2 + Svelte 5 (runes) + Tailwind 4 repo at github.com/hardingjam/parentesi. Read its `CLAUDE.md` and `docs/design-prompt.md` first — the copy and content facts there are canonical.

## About the design files
`Parentesi Canvas.dc.html` is a **design reference built in HTML**, not production code. It shows ten artboards (5 desktop 1440×900, 5 mobile 390×844) with live crossfades and entrance animations, plus annotation notes under every board. Recreate these in the SvelteKit codebase using Svelte components, Tailwind utilities (or a small CSS file for keyframes) and the repo's `static/` assets. Do not ship the HTML.

Open the canvas in a browser to see motion; reload to replay entrances. `support.js` is only the canvas runtime.

## Fidelity
**High-fidelity.** Colours, type sizes, spacing, copy and motion timings are final. Match them exactly. Where a note says "placeholder", the content (not the layout) is still to be supplied by the site owner.

## Design tokens
Colours (only these):
- ecru `#D6CFAF` — all text over photography
- ink `#14120F` — html/body background; fallback while photos load
- base `#0b0a08` — stage background behind photo stack
- scrim: radial gradient of `rgba(11,10,8,a)` — see per-route values
- link underline `rgba(214,207,175,.5)`; hover → `#D6CFAF`
- embed placeholder border `rgba(214,207,175,.45)`

Type: one face, `Typo.ttf` (`static/font/Typo.ttf`, `@font-face{font-family:Typo}`; fallback `'Courier New', monospace`). Weight 400 only. Lowercase except proper nouns.

Desktop (≥1024px) sizes — `size/line-height, letter-spacing`:
- wordmark 64/1, .32em
- manifesto 22/1.6
- list items 15/1.9, .14em
- nav mark & open nav 26/1, .15em
- section label `( food )` 15, .14em
- bio heading 32/1.2, .04em
- body 17/1.65
- restaurant list 17/1.4, gap 10px
- menu lines 18/1.55
- music equation 36/1.3, .04em
- contact lines 22/1.4, .04em; secondary 15, .14em
- contact parentheses 440/1
- credit 12, .08em

Mobile (390px) sizes:
- wordmark 24/1, .18em, single line
- manifesto 17/1.55
- list 13/1.9, .12em
- nav 22/1, .15em (open nav .12em)
- bio heading 24/1.2; body 15/1.6; restaurant list 15/1.4, gap 8px; menu 15/1.5
- equation 22/1.35, .03em, breaks before "="
- contact lines 17/1.4; secondary 13, .12em; parentheses 200px rotated 90°
- credit 11, .08em

Spacing:
- desktop: nav mark top 40 / left 48; credit bottom 36 / left 48; side padding 160; content max-width 700; content gap 44 (home), 56 (music)
- mobile: nav top 56 / left 24; credit bottom 32 / left 24; side padding 28; content gap 36 (home), 44 (music)
- no border radius, no shadows, no decorative gradients anywhere.

## Global stage (all routes)
Layout: `position:fixed; inset:0; overflow:hidden; background:#0b0a08; color:#D6CFAF; font-family:Typo`. `html,body{overflow:hidden; touch-action:none}`.
Layers, back to front:
1. Photo stack — each photo `position:absolute; inset:0; width/height:100%; object-fit:cover`.
2. Scrim — `radial-gradient(ellipse 80% 70% at 50% 45%, rgba(11,10,8,A) 0%, rgba(11,10,8,B) 100%)`; mobile uses `ellipse 110% 70%`.
3. Nav mark `( )` top-left; hit area ≥56×56 (desktop) / ≥44×44 (mobile); hover opacity .7, 200ms.
4. Route content, absolutely centred (flex column, center/center, text-align center unless noted).
5. Photo credit bottom-left: "Photos: Fredericke Alma Sauerbrey" (contact route adds ", Zoe Spawton"). Home desktop also shows "Berlin" bottom-right.

### Crossfade
- 3–4 photos per route; 7s per photo: 5s hold, 2s linear dissolve. Cycle = 7s × n.
- Incoming photo fades in on top of the current one; the outgoing is set to 0 only once fully covered (no flash of base). Reference keyframes for n=4 (percentages of the 28s cycle): `0%{0} 25%{0} 32.14%{1} 57.14%{1} 57.2%{0} 100%{0}`; for n=3 (21s): `0%{0} 33.33%{0} 42.86%{1} 76.19%{1} 76.25%{0} 100%{0}`. Photo i gets `animation-delay: -(3.5 + 7i)s` so one photo is visible at t=0.
- Implement with the Web Animations API (or CSS animations + `playbackRate` via `getAnimations()`) so speed can be modulated.
- Scroll/wheel/swipe acceleration: page never moves. On `wheel`/`touchmove`, set `playbackRate = 1 + min(|deltaY|/120, 6)` on every photo animation, then ease back to 1 over 1.5s (ease-out) after input stops. Pinch ignored.
- `prefers-reduced-motion`: hard cuts every 7s, no entrance animations, nav toggles instantly.

### Entrance (once per route load)
- `rise`: opacity 0→1, translateY 12px→0, 1200ms `cubic-bezier(.2,.6,.2,1)`, `both`.
- Parenthesis "opening" (home wordmark, contact): parens start touching, travel outward, letters/details fade in during the second half. Easing `cubic-bezier(.2,.7,.2,1)`, 1100ms, starting at 300ms; wrapper `rise` 800ms at 100ms; inner text `reveal` 1400ms at 300ms with keyframes `0%{opacity:0} 45%{opacity:0} 100%{opacity:1}`.

## Navigation
Closed: the `( )` mark (two glyphs with .15em tracking). Click → open.
Open (`( food  music  contact )`):
- Desktop: `nav` flex row, gap 40px, top 40 / left 48, 26px. The `)` translates right ~330px over 320ms `cubic-bezier(.2,.7,.2,1)`; route links fade in 200ms each, 60ms stagger, starting at 120ms.
- Mobile: row spans left 24 → right 24 with `justify-content:space-between`, 22px, .12em; each link ≥44px tall.
- Page content behind dims to opacity .35 and an extra `rgba(11,10,8,.35)` full-screen scrim appears (200ms). Photos keep crossfading.
- Current route link at 55% opacity, non-interactive.
- Tap either parenthesis while open → navigate home and close. Tap dimmed page / Esc → close. Close reverses the same easing.
- No hamburger lines, no panel.

## Screens

### Home `/` — desktop
- Photos (4): `( ) Cover.jpg`, `( ) Plating live.jpg`, `( ) Pietro steam.jpg`, `( ) Cutting.jpg`. Scrim .18 → .62.
- Content column, gap 44, padding 0 160:
  1. `h1` wordmark, 64/1 .32em, rendered as three spans `(`, ` p a r e n t e s i `, `)` in a flex row with `white-space:pre`. Entrance: `(` from translateX(300px)→0 and `)` from translateX(-300px)→0 (1100ms, delay 300ms); letters `reveal`.
  2. Manifesto, max-width 700, 22/1.6, two paragraphs gap 14, `rise` at 1500ms:
     "A suspended moment where gastronomy, music, art and conscious consumption create an inspiring dialogue."
     "We believe in food as unity, a form of cultural connection and discovery within a sensory dimension."
  3. Services list, 15/1.9 .14em, one per line, `rise` at 1700ms: circular plant-based dining · tailor-made catering · itinerant experiences · cooking workshops · food consulting.
- Credit bottom-left; "Berlin" bottom-right (12, .08em).

### Home — mobile
Same structure. Wordmark 24/1 .18em single line, paren travel 140px. Manifesto 17/1.55 gap 12; list 13/1.9 .12em. Padding 0 28, gap 36. Scrim .22 → .66.

### Food `/food` — desktop
- Photos (3): Cutting, Plating live, Pietro steam (swap in the daylight plating series `3H6A*.jpg` once converted). Scrim .3 → .72.
- Two-column grid `minmax(0,1fr) minmax(0,1fr)`, gap 120, padding 120 160, vertically centred, left-aligned text.
- Left column (gap 28, `rise` 150ms): label `( food )` 15 .14em; `h2` "Pietro Platania" 32/1.2 .04em; p 17/1.65 "Italian chef, trained at Le Cordon Bleu Paris."; restaurant list 17/1.4 gap 10: Le Bristol*** / Il Luogo di Aimo e Nadia** / Joia* / Vun** / Chez Panisse; p "Founder of Banco Natural Food, Rome. Now cooking in Berlin — plant-based, circular, itinerant."; services list 15/1.9 .14em: supper-club events / tailor-made catering / cooking workshops / food consulting.
- Right column (gap 22, 18/1.55, `rise` 300ms): label `( a sample menu )`; dish lines, each a paragraph with an em-dash:
  "Polenta tuile, spirulina — horseradish paté, grilled radish" (real)
  "Charred leek, hazelnut milk — smoked plum, bread ash" (placeholder)
  "Jerusalem artichoke, koji — sunflower, black garlic" (placeholder)
  "Beetroot aged in salt — blackcurrant leaf, walnut" (placeholder)
  "Quince, chamomile — olive oil, buckwheat" (placeholder)
  closing label `( )` 15 .14em.
- If copy overflows: right column scrolls inside a fixed 560px-tall frame with 60px masked fades; page itself never moves.

### Food — mobile
- Text frame `position:absolute; top:120px; bottom:80px; left:28px; right:28px; overflow-y:auto` (no visible scrollbar), `mask-image: linear-gradient(to bottom, transparent, #000 40px, #000 calc(100% - 60px), transparent)`. Padding-top 40. Scroll inside the frame moves text normally and also accelerates the crossfade.
- Column gap 22: label 13 .12em; h2 24/1.2; p 15/1.6; restaurant list 15/1.4 gap 8; services 13/1.9 .12em; menu label (margin-top 18); menu lines 15/1.5 gap 14 (four shown).
- Scrim .34 → .76.

### Music `/music` — desktop (teaser, darker)
- Photos (3): Pietro steam, Cover, Cutting with `filter: brightness(.6) saturate(.8)`. Scrim `ellipse 70% 60% at 50% 50%`, .45 → .85.
- Content gap 56, padding 0 160:
  1. Equation, 36/1.3 .04em, two lines gap 18 (`rise` 150ms): "Tastes like sound = Planatia" / "Sounds like taste = ( parentesi )".
  2. SoundCloud embed, 560×120, dark theme, single track/player for https://soundcloud.com/planatia (`rise` 300ms). Design shows a 1px `rgba(214,207,175,.45)` bordered placeholder.
  3. Links row gap 40, 15 .14em, 1px bottom border at 50% ecru, hover 100% (`rise` 450ms): soundcloud → https://soundcloud.com/planatia · instagram → https://www.instagram.com/planatia/ · bookings → mailto:parentesi.berlin@gmail.com.
- No bio, no dates. Page ends here.

### Music — mobile
Equation 22/1.35 .03em with `<br>` before "=" in each line, gap 16. Embed full-width, 100px. Links stack vertically gap 14, 13 .12em, ≥44px tap rows. Padding 0 28, gap 44. Scrim `ellipse 100% 60%`, .5 → .88.

### Contact `/contact` — desktop
- Photos (3): Cover, Plating live, Cutting. Scrim .25 → .68.
- Flex row centred, gap 56: `(` 440/1 · contact block · `)` 440/1. Glyphs sit `translateY(-4%)` for optical centring.
- Contact block column gap 22, centred, 22/1.4 .04em: `parentesi.berlin@gmail.com` (mailto) · `+39 340 873 2532` (tel:+393408732532) · `instagram` 15 .14em (handle TBC — placeholder href) · `Berlin · itinerant` 15 .14em, margin-top 10.
- Entrance: wrapper `rise` 800ms; `(` from translateX(200px), `)` from translateX(-200px), 1100ms at 300ms; block `reveal` 1400ms at 300ms.
- Credit: "Photos: Fredericke Alma Sauerbrey, Zoe Spawton".

### Contact — mobile
- Flex column centred, gap 8. Each parenthesis in a 240×120 centred slot, glyph 200/1 `rotate(90deg)` so it brackets above and below.
- Entrance: `(` from translateY(130px), `)` from translateY(-130px) (both keeping the 90° rotation), 1100ms at 300ms; block `reveal`.
- Block 17/1.4 .03em gap 18, padding 24 0; secondary 13 .12em. Credit wraps to two lines.
- Scrim .28 → .72.

## State
- `navOpen: boolean` (layout-level).
- `playbackRate: number` per stage, driven by wheel/touch deltas with a 1.5s decay timer.
- `entered: boolean` per route to run entrance once per load (SvelteKit `onMount`).
- Route-level photo list + scrim values as props to a shared `<Stage>` component.

## Assets (in `static/`)
- `font/Typo.ttf` — brand face.
- `photos/( ) Cover.jpg`, `( ) Cutting.jpg`, `( ) Pietro steam.jpg`, `( ) Plating live.jpg` — moody event series by Fredericke Alma Sauerbrey (URL-encode: `(%20)%20Cover.jpg`). Serve resized/compressed (≤1920px, WebP/AVIF) — originals are 2–3MB.
- Daylight plating series (`3H6A*.jpg`) and Zoe Spawton documentary series exist in the repo but were not used in the canvas; assign them to Food and Contact respectively.
- Photo credits (Sauerbrey; Spawton on contact) are required on every page.

## Files
- `Parentesi Canvas.dc.html` — the ten artboards + spec block + per-board annotations.
- `support.js` — canvas runtime (ignore).
- `static/` — font and photos.
