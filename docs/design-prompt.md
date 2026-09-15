# Design prompt: ( parentesi ) — website design canvas

## What this is

Design a small, atmospheric website for **( parentesi )**, a Berlin-based itinerant food project by Italian chef **Pietro Platania**: plant-based fine dining, supper-club events, tailor-made catering, cooking workshops, and food consulting. The name means *parenthesis* — a suspended moment — and the parentheses `( )` are the logo and the site's core graphic motif.

Its sibling project is **Planatia**, Pietro's music alias (a play on his surname): *"Tastes like sound = Planatia. Sounds like taste = ( parentesi )."*

## Assets — look at these first

Public repo: **https://github.com/hardingjam/parentesi** — everything lives in `static/`. Fetch files raw via `https://raw.githubusercontent.com/hardingjam/parentesi/main/static/...` (URL-encode the filenames — they contain spaces, parentheses and `©`).

- `static/Brochure Example.pdf` — the existing brand document. Beige/ecru ground (~#D6CFAF), near-black typewriter serif, generous whitespace, `( )` used as punctuation-as-logo. **This is the reference identity: evolve it, don't replicate it.** Keep the parentheses motif, typewriter voice, and photography-led warmth; modernize scale, layout, and motion.
- `static/photos/` — three photo families:
  - **Moody event series** (files prefixed `( )`, by Fredericke Alma Sauerbrey): candlelit dinners, chefs under a big black pendant lamp, rising steam, teal Moroccan bowls, a beautiful dusk window-reflection shot (`( ) Cover.jpg`). The emotional heart of the brand.
  - **Daylight plating series** (`3H6A….jpg`): refined vegetable dishes on oak and dark rustic tables, warm plaster walls, candles and wine.
  - **Documentary series** (`parentesi_240327_… © Zoe Spawton_Large.jpg`): brighter, editorial shots of plates and process.
- `static/font/Typo.ttf` — the brand's typewriter-style face; use it (or a close stand-in) for the brand voice, paired with a quiet neutral for small UI text.

## The concept — suspended moments, not scrolling pages

**No long scrolling pages.** Each of the four routes is a single full-screen stage:

- **3–6 full-bleed photos crossfade endlessly behind fixed text** — slow, ambient, hypnotic dissolves (think 8–12s cycles). The copy stays put and always readable (use subtle scrims/vignettes over busy image areas, not heavy overlays).
- **Scrolling/swiping doesn't move the page — it accelerates the crossfade**, like breathing on embers. Annotate this behavior on the artboards.
- Text fades/rises in gently once per page load. Nothing bouncy, nothing showy.

**Navigation is the signature element.** The menu control is the logo itself: a `( )` mark that sits as the "hamburger". On tap/click it opens — ideally the parentheses part and the routes appear between them: `( food  music  contact )`. Lowercase, letter-spaced, typewriter voice. Design both **closed and open states**. The `( )` mark always returns home.

## The four pages

**Home** — wordmark `( p a r e n t e s i )`, then the manifesto:

> A suspended moment where gastronomy, music, art and conscious consumption create an inspiring dialogue.
> We believe in food as unity, a form of cultural connection and discovery within a sensory dimension.

Then the services as a quiet single-line-each list: `circular plant-based dining · tailor-made catering · itinerant experiences · cooking workshops · food consulting`. Imagery: the moody event series.

**Food** — the fullest page. Short bio of Pietro (Le Cordon Bleu Paris; Le Bristol\*\*\*; Il Luogo di Aimo e Nadia\*\*; Joia\*; Vun\*\*; Chez Panisse; founder of Banco Natural Food, Rome; now Berlin) and a sample menu in typewriter style, e.g. *"Polenta tuile, spirulina — horseradish paté, grilled radish"*. Imagery: plating series. If the copy can't fit one elegant screen, it may quietly scroll within a fixed frame — but the page itself stays a stage.

**Music** — a teaser, darker in treatment. The equation as the hero text: *"Tastes like sound = Planatia / Sounds like taste = ( parentesi )"*, one SoundCloud embed or link (https://soundcloud.com/planatia), Instagram (https://www.instagram.com/planatia/), and a bookings pointer. Imagery: steam/pendant-lamp/night shots.

**Contact** — minimal: `parentesi.berlin@gmail.com`, phone, Instagram. Set the contact block inside one large pair of parentheses. Footer credit: *Photos: Fredericke Alma Sauerbrey, Zoe Spawton.*

## Deliverables

**Ten artboards, one coherent direction:** Home, Food, Music, Contact at desktop **1440px** and mobile **390px**, plus the nav in **closed and open** states (can be shown on a Home variant). Annotate motion behavior (crossfade timing, scroll-acceleration, nav transition) directly on the canvas — the site will be built in SvelteKit from these boards, so precision about type sizes, spacing, and color values is appreciated.

**Avoid:** cards, drop shadows, gradients-as-decoration, stock restaurant-site tropes, anything bouncy. The mood is a quiet gallery after dark.
