# ( parentesi ) Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the four-route ( parentesi ) site — full-screen photo stages with endless crossfades behind fixed text, scroll-accelerated dissolves, and a `( )` parenthesis nav — exactly as specified in `design_handoff_parentesi_site/README.md`.

**Architecture:** Each route renders a shared `<Stage>` component (photo stack animated with the Web Animations API + scrim + credit) with route content as a snippet child. Crossfade math lives in a pure module (`src/lib/stage/crossfade.ts`). Nav open/close state is a shared runes module; the `<Nav>` component and the Stage's dim layer both read it. Photos are pre-resized to WebP by a one-off sharp script into `static/img/`.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, Tailwind 4 present but bespoke styles are scoped component CSS + global tokens in `layout.css`. Vitest (node project for pure logic, browser project via Playwright for components). Typo.ttf brand font. sharp (dev-only) for image resizing.

**Canonical spec:** `design_handoff_parentesi_site/README.md` (the design handoff). All sizes, timings, colors, and copy come from there and from `CLAUDE.md`. When this plan and the handoff README disagree, the README wins.

**File structure (final):**

```
scripts/optimize-images.mjs        — one-off sharp resize script
src/lib/content.ts                 — per-route photo stacks, scrims, srcset helper
src/lib/content.test.ts            — data integrity + generated files exist
src/lib/nav.svelte.ts              — shared navOpen runes state
src/lib/stage/crossfade.ts         — pure crossfade/playback math
src/lib/stage/crossfade.test.ts
src/lib/components/Stage.svelte    — photo stack + scrim + dim + credit + input handling
src/lib/components/Stage.svelte.spec.ts
src/lib/components/Nav.svelte      — ( ) mark, open/close, route links
src/lib/components/Nav.svelte.spec.ts
src/routes/+layout.svelte          — font/global css, Nav, per-route content
src/routes/layout.css              — tokens, @font-face, entrance keyframes
src/routes/+page.svelte            — home
src/routes/food/+page.svelte
src/routes/music/+page.svelte
src/routes/contact/+page.svelte
src/lib/assets/favicon.svg         — ( ) mark favicon
static/img/<slug>-{1080,1920}.webp — generated (committed)
```

Deleted: `src/lib/vitest-examples/` (scaffold demo).

---

### Task 1: Housekeeping — tokens, font, entrance keyframes, favicon

**Files:**
- Modify: `src/routes/layout.css`
- Modify: `src/app.html`
- Modify: `src/lib/assets/favicon.svg`
- Delete: `src/lib/vitest-examples/`

- [ ] **Step 1: Delete the scaffold examples**

```bash
git rm -r src/lib/vitest-examples
```

- [ ] **Step 2: Replace `src/routes/layout.css`**

```css
@import 'tailwindcss';
@plugin '@tailwindcss/typography';

@font-face {
	font-family: 'Typo';
	src: url('/font/Typo.ttf') format('truetype');
	font-display: swap;
}

:root {
	--ecru: #d6cfaf;
	--ink: #14120f;
	--base: #0b0a08;
	--ease-entrance: cubic-bezier(0.2, 0.6, 0.2, 1);
	--ease-paren: cubic-bezier(0.2, 0.7, 0.2, 1);
}

html,
body {
	height: 100%;
	overflow: hidden;
	margin: 0;
	background: var(--ink);
	color: var(--ecru);
	font-family: 'Typo', 'Courier New', monospace;
	font-weight: 400;
}

body {
	touch-action: none;
}

a {
	color: inherit;
	text-decoration: none;
}

/* Entrance animations (once per route load). Delay via --d. */
@keyframes rise {
	from {
		opacity: 0;
		transform: translateY(12px);
	}
	to {
		opacity: 1;
		transform: none;
	}
}
@keyframes reveal {
	0% {
		opacity: 0;
	}
	45% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
.rise {
	animation: rise 1200ms var(--ease-entrance) both;
	animation-delay: var(--d, 0ms);
}
.reveal {
	animation: reveal 1400ms var(--ease-entrance) both;
	animation-delay: var(--d, 300ms);
}

@media (prefers-reduced-motion: reduce) {
	.rise,
	.reveal {
		animation: none;
	}
	*,
	*::before,
	*::after {
		transition-duration: 0s !important;
	}
}
```

- [ ] **Step 3: Add theme-color to `src/app.html`** — insert into `<head>` above `%sveltekit.head%`:

```html
		<meta name="theme-color" content="#14120F" />
```

- [ ] **Step 4: Replace `src/lib/assets/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#14120F"/><text x="32" y="43" font-family="'Courier New',monospace" font-size="32" fill="#D6CFAF" text-anchor="middle">( )</text></svg>
```

- [ ] **Step 5: Verify**

Run: `npm run check`
Expected: 0 errors (warnings about unused CSS are fine at this stage).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: brand tokens, Typo font, entrance keyframes, ( ) favicon"
```

---

### Task 2: Image pipeline + content data

**Files:**
- Create: `scripts/optimize-images.mjs`
- Create: `src/lib/content.ts`
- Test: `src/lib/content.test.ts`

- [ ] **Step 1: Write the failing test** — `src/lib/content.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { srcset, stages } from './content';

describe('stages', () => {
	it('defines all four routes with 3-4 photos each', () => {
		for (const key of ['home', 'food', 'music', 'contact'] as const) {
			const n = stages[key].photos.length;
			expect(n, `${key} photo count`).toBeGreaterThanOrEqual(3);
			expect(n, `${key} photo count`).toBeLessThanOrEqual(4);
		}
	});

	it('gives every photo a non-empty alt', () => {
		for (const spec of Object.values(stages)) {
			for (const photo of spec.photos) expect(photo.alt.length).toBeGreaterThan(0);
		}
	});

	it('references only generated image files', () => {
		for (const spec of Object.values(stages)) {
			for (const { slug } of spec.photos) {
				for (const w of [1080, 1920]) {
					expect(existsSync(`static/img/${slug}-${w}.webp`), `${slug}-${w}`).toBe(true);
				}
			}
		}
	});

	it('builds a srcset from a slug', () => {
		expect(srcset('cover')).toBe('/img/cover-1080.webp 1080w, /img/cover-1920.webp 1920w');
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run --project server src/lib/content.test.ts`
Expected: FAIL — cannot resolve `./content`.

- [ ] **Step 3: Add sharp and the resize script**

```bash
npm install -D sharp
```

`scripts/optimize-images.mjs`:

```js
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const photos = [
	['static/photos/( ) Cover.jpg', 'cover'],
	['static/photos/( ) Plating live.jpg', 'plating-live'],
	['static/photos/( ) Pietro steam.jpg', 'pietro-steam'],
	['static/photos/( ) Cutting.jpg', 'cutting']
];

await mkdir('static/img', { recursive: true });
for (const [src, slug] of photos) {
	for (const width of [1080, 1920]) {
		const out = `static/img/${slug}-${width}.webp`;
		await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 72 }).toFile(out);
		console.log('wrote', out);
	}
}
```

Run: `node scripts/optimize-images.mjs`
Expected: 8 `wrote static/img/…` lines; each file well under 500KB (`ls -lh static/img`).

- [ ] **Step 4: Write `src/lib/content.ts`**

```ts
export interface StagePhoto {
	slug: string;
	alt: string;
}

export interface StageSpec {
	photos: StagePhoto[];
	/** Full CSS background values for the scrim layer. */
	scrimDesktop: string;
	scrimMobile: string;
	/** Optional CSS filter applied to every photo (music route). */
	filter?: string;
}

const scrim = (shape: string, inner: number, outer: number) =>
	`radial-gradient(ellipse ${shape}, rgba(11,10,8,${inner}) 0%, rgba(11,10,8,${outer}) 100%)`;

export const srcset = (slug: string) =>
	`/img/${slug}-1080.webp 1080w, /img/${slug}-1920.webp 1920w`;

const cover: StagePhoto = {
	slug: 'cover',
	alt: 'The parentesi kitchen at dusk, seen through a window reflecting a brick courtyard'
};
const platingLive: StagePhoto = {
	slug: 'plating-live',
	alt: 'Chefs plating dishes in front of guests at a candlelit dinner'
};
const pietroSteam: StagePhoto = {
	slug: 'pietro-steam',
	alt: 'Steam rising under a pendant lamp while chefs cook'
};
const cutting: StagePhoto = {
	slug: 'cutting',
	alt: 'Hands slicing spring onions on a wooden board'
};

export const stages: Record<'home' | 'food' | 'music' | 'contact', StageSpec> = {
	home: {
		photos: [cover, platingLive, pietroSteam, cutting],
		scrimDesktop: scrim('80% 70% at 50% 45%', 0.18, 0.62),
		scrimMobile: scrim('110% 70% at 50% 45%', 0.22, 0.66)
	},
	food: {
		photos: [cutting, platingLive, pietroSteam],
		scrimDesktop: scrim('80% 70% at 50% 45%', 0.3, 0.72),
		scrimMobile: scrim('110% 70% at 50% 45%', 0.34, 0.76)
	},
	music: {
		photos: [pietroSteam, cover, cutting],
		filter: 'brightness(.6) saturate(.8)',
		scrimDesktop: scrim('70% 60% at 50% 50%', 0.45, 0.85),
		scrimMobile: scrim('100% 60% at 50% 50%', 0.5, 0.88)
	},
	contact: {
		photos: [cover, platingLive, cutting],
		scrimDesktop: scrim('80% 70% at 50% 45%', 0.25, 0.68),
		scrimMobile: scrim('110% 70% at 50% 45%', 0.28, 0.72)
	}
};
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run --project server src/lib/content.test.ts`
Expected: 4 passing.

- [ ] **Step 6: Commit** (generated images are committed — they are site assets)

```bash
git add -A && git commit -m "feat: optimized web images and per-route stage content data"
```

---

### Task 3: Crossfade math (pure, TDD)

**Files:**
- Create: `src/lib/stage/crossfade.ts`
- Test: `src/lib/stage/crossfade.test.ts`

Reference behavior (handoff README): 7s per photo = 5s hold + 2s linear dissolve; incoming fades in over the current; outgoing released only once covered. For n=4 (28s cycle) the opacity keyframes are `0%:0, 25%:0, 32.14%:1, 57.14%:1, 57.2%:0, 100%:0`; photo *i* gets `animation-delay: -(3.5 + 7i)s`. Scroll sets `playbackRate = 1 + min(|deltaY|/120, 6)`, easing back to 1 over 1.5s after input stops.

- [ ] **Step 1: Write the failing test** — `src/lib/stage/crossfade.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
	DECAY_MS,
	crossfadeKeyframes,
	cycleSeconds,
	decayedRate,
	photoDelaySeconds,
	rateFromDelta
} from './crossfade';

describe('cycleSeconds', () => {
	it('is 7s per photo', () => {
		expect(cycleSeconds(3)).toBe(21);
		expect(cycleSeconds(4)).toBe(28);
	});
});

describe('crossfadeKeyframes', () => {
	it('matches the reference offsets for n=4', () => {
		const kf = crossfadeKeyframes(4);
		expect(kf.map((k) => k.opacity)).toEqual([0, 0, 1, 1, 0, 0]);
		const offsets = kf.map((k) => k.offset as number);
		expect(offsets[0]).toBe(0);
		expect(offsets[1]).toBeCloseTo(0.25, 4);
		expect(offsets[2]).toBeCloseTo(0.3214, 3);
		expect(offsets[3]).toBeCloseTo(0.5714, 3);
		expect(offsets[4]).toBeCloseTo(0.572, 3);
		expect(offsets[5]).toBe(1);
	});

	it('matches the reference offsets for n=3', () => {
		const offsets = crossfadeKeyframes(3).map((k) => k.offset as number);
		expect(offsets[1]).toBeCloseTo(0.3333, 3);
		expect(offsets[2]).toBeCloseTo(0.4286, 3);
		expect(offsets[3]).toBeCloseTo(0.7619, 3);
	});

	it('rejects stacks smaller than 3', () => {
		expect(() => crossfadeKeyframes(2)).toThrow();
	});
});

describe('photoDelaySeconds', () => {
	it('offsets each photo by -7s starting at -3.5s', () => {
		expect(photoDelaySeconds(0)).toBe(-3.5);
		expect(photoDelaySeconds(1)).toBe(-10.5);
		expect(photoDelaySeconds(3)).toBe(-24.5);
	});
});

describe('rateFromDelta', () => {
	it('maps wheel delta to playback rate, capped at 7', () => {
		expect(rateFromDelta(0)).toBe(1);
		expect(rateFromDelta(120)).toBe(2);
		expect(rateFromDelta(-120)).toBe(2);
		expect(rateFromDelta(100000)).toBe(7);
	});
});

describe('decayedRate', () => {
	it('starts at the boosted rate and returns to 1 after DECAY_MS', () => {
		expect(decayedRate(5, 0)).toBe(5);
		expect(decayedRate(5, DECAY_MS)).toBe(1);
		expect(decayedRate(5, DECAY_MS * 2)).toBe(1);
	});

	it('decays monotonically', () => {
		const samples = [0, 300, 600, 900, 1200, 1500].map((t) => decayedRate(4, t));
		for (let i = 1; i < samples.length; i++) expect(samples[i]).toBeLessThanOrEqual(samples[i - 1]);
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run --project server src/lib/stage/crossfade.test.ts`
Expected: FAIL — cannot resolve `./crossfade`.

- [ ] **Step 3: Write `src/lib/stage/crossfade.ts`**

```ts
export const SECONDS_PER_PHOTO = 7;
export const DISSOLVE_SECONDS = 2;
export const DECAY_MS = 1500;
const RELEASE_EPSILON = 0.0006;

export function cycleSeconds(count: number): number {
	return SECONDS_PER_PHOTO * count;
}

/**
 * Opacity keyframes for one photo in an n-photo endless crossfade.
 * The photo fades in over the current one and is released (cut to 0)
 * only once the next photo fully covers it — no flash of the base.
 */
export function crossfadeKeyframes(count: number): Keyframe[] {
	if (count < 3) throw new Error(`crossfade needs at least 3 photos, got ${count}`);
	const cycle = cycleSeconds(count);
	const fadeInStart = SECONDS_PER_PHOTO / cycle;
	const fullAt = (SECONDS_PER_PHOTO + DISSOLVE_SECONDS) / cycle;
	const releaseAt = (2 * SECONDS_PER_PHOTO + DISSOLVE_SECONDS) / cycle;
	return [
		{ opacity: 0, offset: 0 },
		{ opacity: 0, offset: fadeInStart },
		{ opacity: 1, offset: fullAt },
		{ opacity: 1, offset: releaseAt },
		{ opacity: 0, offset: releaseAt + RELEASE_EPSILON },
		{ opacity: 0, offset: 1 }
	];
}

/** Negative delay so photo i is mid-hold at t=0 and exactly one photo is visible. */
export function photoDelaySeconds(index: number): number {
	return -(SECONDS_PER_PHOTO / 2 + SECONDS_PER_PHOTO * index);
}

/** Wheel/touch delta → playback rate, 1..7. */
export function rateFromDelta(deltaY: number): number {
	return 1 + Math.min(Math.abs(deltaY) / 120, 6);
}

/** Ease the boosted rate back to 1 over DECAY_MS (cubic ease-out). */
export function decayedRate(rate: number, elapsedMs: number): number {
	if (elapsedMs >= DECAY_MS) return 1;
	const u = Math.max(elapsedMs, 0) / DECAY_MS;
	const eased = 1 - Math.pow(1 - u, 3);
	return rate + (1 - rate) * eased;
}
```

Note: `photoDelaySeconds(0)` must be `-3.5` — `SECONDS_PER_PHOTO / 2` is 3.5.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run --project server src/lib/stage/crossfade.test.ts`
Expected: all passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/stage && git commit -m "feat: crossfade timing and playback-rate math"
```

---

### Task 4: Nav state + Nav component

**Files:**
- Create: `src/lib/nav.svelte.ts`
- Create: `src/lib/components/Nav.svelte`
- Test: `src/lib/components/Nav.svelte.spec.ts`

Nav spec: closed = the `( )` mark top-left (26px desktop / 22px mobile, .15em). Open = `( food  music  contact )`; the `)` translates right ~330px (desktop) over 320ms `var(--ease-paren)`; links fade in 200ms each with 60ms stagger from 120ms. Mobile open: row spans left 24 → right 24, space-between. Current route at 55% opacity, non-interactive. Parens navigate home when open. Esc closes. `Nav` takes `current` (pathname) as a prop so it is testable without `$app/state`.

- [ ] **Step 1: Write `src/lib/nav.svelte.ts`**

```ts
export const nav = $state({ open: false });

export function toggleNav() {
	nav.open = !nav.open;
}

export function closeNav() {
	nav.open = false;
}
```

- [ ] **Step 2: Write the failing test** — `src/lib/components/Nav.svelte.spec.ts`:

```ts
import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { nav } from '$lib/nav.svelte';
import Nav from './Nav.svelte';

describe('Nav.svelte', () => {
	beforeEach(() => {
		nav.open = false;
	});

	it('shows only the ( ) mark when closed', async () => {
		render(Nav, { current: '/' });
		await expect.element(page.getByRole('button', { name: 'open menu' })).toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: 'food' })).not.toBeVisible();
	});

	it('opens to reveal the route links', async () => {
		render(Nav, { current: '/' });
		await page.getByRole('button', { name: 'open menu' }).first().click();
		expect(nav.open).toBe(true);
		await expect.element(page.getByRole('link', { name: 'food' })).toBeVisible();
		await expect.element(page.getByRole('link', { name: 'music' })).toBeVisible();
		await expect.element(page.getByRole('link', { name: 'contact' })).toBeVisible();
	});

	it('marks the current route non-interactive', async () => {
		nav.open = true;
		render(Nav, { current: '/food' });
		await expect
			.element(page.getByRole('link', { name: 'food' }))
			.toHaveAttribute('aria-current', 'page');
	});

	it('closes on Escape', async () => {
		nav.open = true;
		render(Nav, { current: '/' });
		await page.getByRole('link', { name: 'food' }).click({ trial: true });
		await new Promise((r) => setTimeout(r, 50));
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		await expect.poll(() => nav.open).toBe(false);
	});
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run --project client src/lib/components/Nav.svelte.spec.ts`
Expected: FAIL — cannot resolve `./Nav.svelte`.

- [ ] **Step 4: Write `src/lib/components/Nav.svelte`**

```svelte
<script lang="ts">
	import { closeNav, nav, toggleNav } from '$lib/nav.svelte';

	let { current }: { current: string } = $props();

	const routes = [
		{ href: '/food', label: 'food' },
		{ href: '/music', label: 'music' },
		{ href: '/contact', label: 'contact' }
	];

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') closeNav();
	}
</script>

<svelte:window onkeydown={onKeydown} />

<nav class:open={nav.open} aria-label="site">
	{#if nav.open}
		<a class="paren" href="/" onclick={closeNav} aria-label="home">(</a>
	{:else}
		<button class="paren" onclick={toggleNav} aria-label="open menu">(</button>
	{/if}
	<div class="links" aria-hidden={!nav.open}>
		{#each routes as route, i (route.href)}
			<a
				href={route.href}
				style="--i: {i}"
				aria-current={current === route.href ? 'page' : undefined}
				tabindex={nav.open ? undefined : -1}
				onclick={closeNav}>{route.label}</a
			>
		{/each}
	</div>
	{#if nav.open}
		<a class="paren closing" href="/" onclick={closeNav} aria-label="home">)</a>
	{:else}
		<button class="paren closing" onclick={toggleNav} aria-label="open menu">)</button>
	{/if}
</nav>

<style>
	nav {
		position: fixed;
		top: 40px;
		left: 48px;
		z-index: 30;
		display: flex;
		align-items: center;
		font-size: 26px;
		letter-spacing: 0.15em;
	}
	.paren {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 56px;
		min-height: 56px;
		margin: -15px 0;
		padding: 0;
		border: 0;
		background: none;
		color: var(--ecru);
		font: inherit;
		letter-spacing: inherit;
		cursor: pointer;
		transition: opacity 200ms;
	}
	.paren:hover {
		opacity: 0.7;
	}
	.closing {
		transition:
			transform 320ms var(--ease-paren),
			opacity 200ms;
	}
	nav.open .closing {
		transform: translateX(0);
	}
	.links {
		position: absolute;
		left: 56px;
		display: flex;
		gap: 40px;
		white-space: nowrap;
	}
	.links a {
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 200ms,
			visibility 0s 200ms;
	}
	nav.open .links a {
		opacity: 1;
		visibility: visible;
		transition:
			opacity 200ms,
			visibility 0s;
		transition-delay: calc(120ms + var(--i) * 60ms);
	}
	nav.open .links a[aria-current='page'] {
		opacity: 0.55;
		pointer-events: none;
	}
	nav:not(.open) .closing {
		transform: translateX(-330px);
	}
	/* The ) sits 330px right of ( when open; collapse it beside ( when closed.
	   Implemented inversely (translate to rest position when open) so the open
	   layout is the natural flow: ( … links … ) */
	nav {
		width: 440px;
	}
	.closing {
		margin-left: auto;
	}

	@media (max-width: 1023px) {
		nav {
			top: 56px;
			left: 24px;
			right: 24px;
			width: auto;
			font-size: 22px;
		}
		.paren {
			min-width: 44px;
			min-height: 44px;
			margin: -11px 0;
		}
		.links {
			position: static;
			flex: 1;
			justify-content: space-evenly;
			gap: 0;
			letter-spacing: 0.12em;
		}
		.links a {
			display: flex;
			align-items: center;
			min-height: 44px;
		}
		nav:not(.open) .closing {
			transform: translateX(0);
		}
		nav:not(.open) {
			width: 88px;
		}
		nav:not(.open) .links {
			flex: 0;
		}
	}
</style>
```

Layout note: desktop closed state must render as a compact `( )` pair. The mobile block achieves this by collapsing nav width; on desktop the `)` is translated left −330px to sit beside `(`. After implementing, verify visually (Task 9) that closed = compact `( )` and open = full row on both breakpoints, and adjust the travel distance so the open `)` lands ~330px from `(` on desktop.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run --project client src/lib/components/Nav.svelte.spec.ts`
Expected: all passing.

- [ ] **Step 6: Commit**

```bash
git add src/lib/nav.svelte.ts src/lib/components && git commit -m "feat: parenthesis nav with shared open state"
```

---

### Task 5: Stage component

**Files:**
- Create: `src/lib/components/Stage.svelte`
- Test: `src/lib/components/Stage.svelte.spec.ts`

Stage spec: fixed full-viewport stage, layers back→front: photo stack (WAAPI crossfade), scrim, nav-dim scrim, centered content, credit bottom-left (+ optional corner text bottom-right). Wheel/touchmove boost `playbackRate` on all photo animations, decaying to 1 over 1.5s. `prefers-reduced-motion`: hard cuts every 7s. When `nav.open`: content dims to 0.35 and an extra `rgba(11,10,8,.35)` scrim fades in over 200ms; photos keep animating.

- [ ] **Step 1: Write the failing test** — `src/lib/components/Stage.svelte.spec.ts`:

```ts
import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import { nav } from '$lib/nav.svelte';
import { stages } from '$lib/content';
import Stage from './Stage.svelte';

const content = createRawSnippet(() => ({
	render: () => '<p>stage content</p>'
}));

describe('Stage.svelte', () => {
	beforeEach(() => {
		nav.open = false;
	});

	it('renders every photo with an alt and the content snippet', async () => {
		render(Stage, { spec: stages.home, children: content });
		await expect.element(page.getByText('stage content')).toBeVisible();
		for (const photo of stages.home.photos) {
			await expect.element(page.getByAltText(photo.alt)).toBeInTheDocument();
		}
	});

	it('shows the photo credit', async () => {
		render(Stage, {
			spec: stages.contact,
			credit: 'Photos: Fredericke Alma Sauerbrey, Zoe Spawton',
			children: content
		});
		await expect
			.element(page.getByText('Photos: Fredericke Alma Sauerbrey, Zoe Spawton'))
			.toBeVisible();
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run --project client src/lib/components/Stage.svelte.spec.ts`
Expected: FAIL — cannot resolve `./Stage.svelte`.

- [ ] **Step 3: Write `src/lib/components/Stage.svelte`**

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { srcset, type StageSpec } from '$lib/content';
	import { nav } from '$lib/nav.svelte';
	import {
		SECONDS_PER_PHOTO,
		crossfadeKeyframes,
		cycleSeconds,
		decayedRate,
		photoDelaySeconds,
		rateFromDelta
	} from '$lib/stage/crossfade';

	let {
		spec,
		credit = 'Photos: Fredericke Alma Sauerbrey',
		corner,
		children
	}: {
		spec: StageSpec;
		credit?: string;
		corner?: string;
		children: Snippet;
	} = $props();

	let stack: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!stack) return;
		const imgs = [...stack.querySelectorAll('img')];
		if (imgs.length < 3) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			let visible = 0;
			imgs.forEach((el, i) => (el.style.opacity = i === 0 ? '1' : '0'));
			const id = setInterval(() => {
				imgs[visible].style.opacity = '0';
				visible = (visible + 1) % imgs.length;
				imgs[visible].style.opacity = '1';
			}, SECONDS_PER_PHOTO * 1000);
			return () => clearInterval(id);
		}

		const keyframes = crossfadeKeyframes(imgs.length);
		const duration = cycleSeconds(imgs.length) * 1000;
		const animations = imgs.map((el, i) =>
			el.animate(keyframes, {
				duration,
				iterations: Infinity,
				delay: photoDelaySeconds(i) * 1000
			})
		);

		let boostedRate = 1;
		let lastInput = 0;
		let raf = 0;
		const applyRate = (rate: number) => {
			for (const animation of animations) animation.playbackRate = rate;
		};
		const tick = () => {
			const rate = decayedRate(boostedRate, performance.now() - lastInput);
			applyRate(rate);
			if (rate > 1.001) {
				raf = requestAnimationFrame(tick);
			} else {
				raf = 0;
				applyRate(1);
			}
		};
		const boost = (delta: number) => {
			boostedRate = rateFromDelta(delta);
			lastInput = performance.now();
			if (!raf) raf = requestAnimationFrame(tick);
		};

		let lastTouchY: number | null = null;
		const onWheel = (e: WheelEvent) => boost(e.deltaY);
		const onTouchMove = (e: TouchEvent) => {
			const y = e.touches[0].clientY;
			if (lastTouchY !== null) boost((lastTouchY - y) * 3);
			lastTouchY = y;
		};
		const onTouchEnd = () => (lastTouchY = null);
		window.addEventListener('wheel', onWheel, { passive: true });
		window.addEventListener('touchmove', onTouchMove, { passive: true });
		window.addEventListener('touchend', onTouchEnd, { passive: true });

		return () => {
			window.removeEventListener('wheel', onWheel);
			window.removeEventListener('touchmove', onTouchMove);
			window.removeEventListener('touchend', onTouchEnd);
			if (raf) cancelAnimationFrame(raf);
			for (const animation of animations) animation.cancel();
		};
	});
</script>

<div class="stage" style="--scrim-d: {spec.scrimDesktop}; --scrim-m: {spec.scrimMobile}">
	<div class="stack" bind:this={stack} aria-hidden="false">
		{#each spec.photos as photo, i (photo.slug)}
			<img
				srcset={srcset(photo.slug)}
				sizes="100vw"
				alt={photo.alt}
				style:filter={spec.filter}
				loading={i === 0 ? 'eager' : 'lazy'}
				decoding="async"
			/>
		{/each}
	</div>
	<div class="scrim"></div>
	<div class="nav-scrim" class:visible={nav.open}></div>
	<div class="content" class:dimmed={nav.open}>
		{@render children()}
	</div>
	<p class="credit">{credit}</p>
	{#if corner}
		<p class="credit corner">{corner}</p>
	{/if}
</div>

<style>
	.stage {
		position: fixed;
		inset: 0;
		overflow: hidden;
		background: var(--base);
	}
	.stack,
	.scrim,
	.nav-scrim {
		position: absolute;
		inset: 0;
	}
	.stack img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
	}
	.stack img:first-child {
		opacity: 1;
	}
	.scrim {
		background: var(--scrim-d);
	}
	.nav-scrim {
		background: rgba(11, 10, 8, 0.35);
		opacity: 0;
		pointer-events: none;
		transition: opacity 200ms;
	}
	.nav-scrim.visible {
		opacity: 1;
	}
	.content {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 0 160px;
		transition: opacity 200ms;
	}
	.content.dimmed {
		opacity: 0.35;
	}
	.credit {
		position: absolute;
		bottom: 36px;
		left: 48px;
		margin: 0;
		font-size: 12px;
		letter-spacing: 0.08em;
	}
	.corner {
		left: auto;
		right: 48px;
	}

	@media (max-width: 1023px) {
		.scrim {
			background: var(--scrim-m);
		}
		.content {
			padding: 0 28px;
		}
		.credit {
			bottom: 32px;
			left: 24px;
			font-size: 11px;
		}
		.corner {
			left: auto;
			right: 24px;
		}
	}
</style>
```

Note: images start at `opacity: 0` (first child at 1) so nothing flashes before the WAAPI animations take over — the animations' negative delays put exactly one photo at full opacity immediately.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run --project client src/lib/components/Stage.svelte.spec.ts`
Expected: all passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/Stage.svelte src/lib/components/Stage.svelte.spec.ts
git commit -m "feat: crossfading photo stage with scroll-accelerated dissolve"
```

---

### Task 6: Layout + Home route

**Files:**
- Modify: `src/routes/+layout.svelte`
- Modify: `src/routes/+page.svelte`

- [ ] **Step 1: Replace `src/routes/+layout.svelte`**

```svelte
<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import Nav from '$lib/components/Nav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="description" content="( parentesi ) — a suspended moment. Plant-based dining, catering, workshops and itinerant events by chef Pietro Platania, Berlin." />
</svelte:head>

{#key page.url.pathname}
	{@render children()}
{/key}
<Nav current={page.url.pathname} />
```

(`{#key}` remounts the route content on navigation so entrance animations replay once per route load.)

- [ ] **Step 2: Replace `src/routes/+page.svelte`** (Home)

```svelte
<script lang="ts">
	import Stage from '$lib/components/Stage.svelte';
	import { stages } from '$lib/content';

	const services = [
		'circular plant-based dining',
		'tailor-made catering',
		'itinerant experiences',
		'cooking workshops',
		'food consulting'
	];
</script>

<svelte:head>
	<title>( parentesi )</title>
</svelte:head>

<Stage spec={stages.home} corner="Berlin">
	<h1 class="wordmark rise" style="--d: 100ms" aria-label="parentesi">
		<span class="paren left">(</span><span class="letters reveal">&nbsp;p a r e n t e s i&nbsp;</span><span class="paren right">)</span>
	</h1>
	<div class="manifesto rise" style="--d: 1500ms">
		<p>
			A suspended moment where gastronomy, music, art and conscious consumption create an
			inspiring dialogue.
		</p>
		<p>
			We believe in food as unity, a form of cultural connection and discovery within a sensory
			dimension.
		</p>
	</div>
	<ul class="services rise" style="--d: 1700ms">
		{#each services as service (service)}
			<li>{service}</li>
		{/each}
	</ul>
</Stage>

<style>
	.wordmark {
		display: flex;
		align-items: baseline;
		margin: 0 0 44px;
		font-size: 64px;
		font-weight: 400;
		line-height: 1;
		letter-spacing: 0.32em;
		white-space: pre;
		--travel: 300px;
	}
	.paren {
		animation: 1100ms var(--ease-paren) 300ms both;
	}
	.left {
		animation-name: from-right;
	}
	.right {
		animation-name: from-left;
	}
	@keyframes from-right {
		from {
			transform: translateX(var(--travel));
		}
	}
	@keyframes from-left {
		from {
			transform: translateX(calc(-1 * var(--travel)));
		}
	}
	.manifesto {
		max-width: 700px;
		font-size: 22px;
		line-height: 1.6;
	}
	.manifesto p {
		margin: 0;
	}
	.manifesto p + p {
		margin-top: 14px;
	}
	.services {
		margin: 44px 0 0;
		padding: 0;
		list-style: none;
		font-size: 15px;
		line-height: 1.9;
		letter-spacing: 0.14em;
	}

	@media (prefers-reduced-motion: reduce) {
		.paren {
			animation: none;
		}
	}

	@media (max-width: 1023px) {
		.wordmark {
			margin-bottom: 36px;
			font-size: 24px;
			letter-spacing: 0.18em;
			--travel: 140px;
		}
		.manifesto {
			font-size: 17px;
			line-height: 1.55;
		}
		.manifesto p + p {
			margin-top: 12px;
		}
		.services {
			margin-top: 36px;
			font-size: 13px;
			letter-spacing: 0.12em;
		}
	}
</style>
```

- [ ] **Step 3: Verify in dev**

Run: `npm run check` (expected: 0 errors), then start the dev server and load `/`: wordmark parens travel in, letters reveal, manifesto and services rise, four photos crossfade (~7s apart), scroll speeds the dissolve, `( )` opens the nav, "Berlin" bottom-right.

- [ ] **Step 4: Commit**

```bash
git add src/routes && git commit -m "feat: layout with nav and home stage"
```

---

### Task 7: Food route

**Files:**
- Create: `src/routes/food/+page.svelte`

Desktop: two-column grid (bio left, sample menu right), left-aligned, `rise` at 150/300ms. Mobile: an absolutely-positioned scrollable text frame (top 120 / bottom 80 / sides 28) with masked fades; inner scroll must still work (`touch-action: pan-y` on the frame) and the page never moves.

- [ ] **Step 1: Write `src/routes/food/+page.svelte`**

```svelte
<script lang="ts">
	import Stage from '$lib/components/Stage.svelte';
	import { stages } from '$lib/content';

	const restaurants = [
		'Le Bristol***',
		'Il Luogo di Aimo e Nadia**',
		'Joia*',
		'Vun**',
		'Chez Panisse'
	];
	const services = [
		'supper-club events',
		'tailor-made catering',
		'cooking workshops',
		'food consulting'
	];
	const menu = [
		'Polenta tuile, spirulina — horseradish paté, grilled radish',
		'Charred leek, hazelnut milk — smoked plum, bread ash',
		'Jerusalem artichoke, koji — sunflower, black garlic',
		'Beetroot aged in salt — blackcurrant leaf, walnut',
		'Quince, chamomile — olive oil, buckwheat'
	];
</script>

<svelte:head>
	<title>( food ) — parentesi</title>
</svelte:head>

<Stage spec={stages.food}>
	<div class="frame">
		<div class="grid">
			<div class="bio rise" style="--d: 150ms">
				<p class="label">( food )</p>
				<h2>Pietro Platania</h2>
				<p>Italian chef, trained at Le Cordon Bleu Paris.</p>
				<ul class="restaurants">
					{#each restaurants as restaurant (restaurant)}
						<li>{restaurant}</li>
					{/each}
				</ul>
				<p>
					Founder of Banco Natural Food, Rome. Now cooking in Berlin — plant-based, circular,
					itinerant.
				</p>
				<ul class="services">
					{#each services as service (service)}
						<li>{service}</li>
					{/each}
				</ul>
			</div>
			<div class="menu rise" style="--d: 300ms">
				<p class="label">( a sample menu )</p>
				{#each menu as dish (dish)}
					<p class="dish">{dish}</p>
				{/each}
				<p class="label">( )</p>
			</div>
		</div>
	</div>
</Stage>

<style>
	.frame {
		width: 100%;
	}
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 120px;
		text-align: left;
	}
	.label {
		margin: 0;
		font-size: 15px;
		letter-spacing: 0.14em;
	}
	.bio,
	.menu {
		display: flex;
		flex-direction: column;
	}
	.bio {
		gap: 28px;
	}
	.menu {
		gap: 22px;
		max-height: 560px;
		overflow-y: auto;
		scrollbar-width: none;
		mask-image: linear-gradient(
			to bottom,
			transparent,
			#000 60px,
			#000 calc(100% - 60px),
			transparent
		);
	}
	.menu::-webkit-scrollbar {
		display: none;
	}
	h2 {
		margin: 0;
		font-size: 32px;
		font-weight: 400;
		line-height: 1.2;
		letter-spacing: 0.04em;
	}
	.bio p {
		margin: 0;
		font-size: 17px;
		line-height: 1.65;
	}
	.restaurants {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 17px;
		line-height: 1.4;
	}
	.services {
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 15px;
		line-height: 1.9;
		letter-spacing: 0.14em;
	}
	.dish {
		margin: 0;
		font-size: 18px;
		line-height: 1.55;
	}

	@media (max-width: 1023px) {
		.frame {
			position: absolute;
			top: 120px;
			right: 28px;
			bottom: 80px;
			left: 28px;
			overflow-y: auto;
			padding-top: 40px;
			touch-action: pan-y;
			scrollbar-width: none;
			mask-image: linear-gradient(
				to bottom,
				transparent,
				#000 40px,
				#000 calc(100% - 60px),
				transparent
			);
		}
		.frame::-webkit-scrollbar {
			display: none;
		}
		.grid {
			display: flex;
			flex-direction: column;
			gap: 22px;
		}
		.menu {
			max-height: none;
			overflow: visible;
			mask-image: none;
			gap: 14px;
		}
		.menu > .label:first-child {
			margin-top: 18px;
		}
		.label {
			font-size: 13px;
			letter-spacing: 0.12em;
		}
		h2 {
			font-size: 24px;
		}
		.bio {
			gap: 22px;
		}
		.bio p {
			font-size: 15px;
			line-height: 1.6;
		}
		.restaurants {
			gap: 8px;
			font-size: 15px;
		}
		.services {
			font-size: 13px;
			letter-spacing: 0.12em;
		}
		.dish {
			font-size: 15px;
			line-height: 1.5;
		}
	}
</style>
```

Note the Stage content wrapper centers and text-aligns center — the `.grid` overrides with `text-align: left`. On desktop the grid needs the Stage's 160px side padding, which it inherits. Menu placeholders (dishes 2–5) are flagged in the handoff as owner-supplied content later; ship them as-is.

- [ ] **Step 2: Verify in dev**

`npm run check` → 0 errors. In the browser: desktop two columns; mobile (390px viewport) text scrolls inside the masked frame while the page stays fixed and the crossfade accelerates.

- [ ] **Step 3: Commit**

```bash
git add src/routes/food && git commit -m "feat: food route"
```

---

### Task 8: Music + Contact routes

**Files:**
- Create: `src/routes/music/+page.svelte`
- Create: `src/routes/contact/+page.svelte`

- [ ] **Step 1: Write `src/routes/music/+page.svelte`**

```svelte
<script lang="ts">
	import Stage from '$lib/components/Stage.svelte';
	import { stages } from '$lib/content';

	const soundcloudSrc =
		'https://w.soundcloud.com/player/?url=' +
		encodeURIComponent('https://soundcloud.com/planatia') +
		'&color=%23d6cfaf&auto_play=false&show_user=true&visual=false';
</script>

<svelte:head>
	<title>( music ) — parentesi</title>
</svelte:head>

<Stage spec={stages.music}>
	<div class="equation rise" style="--d: 150ms">
		<p>Tastes like sound <span class="eq">= Planatia</span></p>
		<p>Sounds like taste <span class="eq">= ( parentesi )</span></p>
	</div>
	<div class="embed rise" style="--d: 300ms">
		<iframe
			title="Planatia on SoundCloud"
			src={soundcloudSrc}
			width="100%"
			height="120"
			allow="autoplay"
			loading="lazy"
			frameborder="0"
		></iframe>
	</div>
	<ul class="links rise" style="--d: 450ms">
		<li><a href="https://soundcloud.com/planatia" rel="external">soundcloud</a></li>
		<li><a href="https://www.instagram.com/planatia/" rel="external">instagram</a></li>
		<li><a href="mailto:parentesi.berlin@gmail.com">bookings</a></li>
	</ul>
</Stage>

<style>
	.equation {
		font-size: 36px;
		line-height: 1.3;
		letter-spacing: 0.04em;
	}
	.equation p {
		margin: 0;
	}
	.equation p + p {
		margin-top: 18px;
	}
	.eq {
		white-space: nowrap;
	}
	.embed {
		width: 560px;
		max-width: 100%;
		margin-top: 56px;
		border: 1px solid rgba(214, 207, 175, 0.45);
	}
	.embed iframe {
		display: block;
	}
	.links {
		display: flex;
		gap: 40px;
		margin: 56px 0 0;
		padding: 0;
		list-style: none;
		font-size: 15px;
		letter-spacing: 0.14em;
	}
	.links a {
		border-bottom: 1px solid rgba(214, 207, 175, 0.5);
		transition: border-color 200ms;
	}
	.links a:hover {
		border-color: var(--ecru);
	}

	@media (max-width: 1023px) {
		.equation {
			font-size: 22px;
			line-height: 1.35;
			letter-spacing: 0.03em;
		}
		.equation .eq {
			display: block;
		}
		.equation p + p {
			margin-top: 16px;
		}
		.embed {
			width: 100%;
			margin-top: 44px;
		}
		.embed iframe {
			height: 100px;
		}
		.links {
			flex-direction: column;
			gap: 14px;
			margin-top: 44px;
			font-size: 13px;
			letter-spacing: 0.12em;
		}
		.links a {
			display: inline-flex;
			align-items: center;
			min-height: 44px;
		}
	}
</style>
```

(The `.eq` span implements the mobile "break before =" requirement.)

- [ ] **Step 2: Write `src/routes/contact/+page.svelte`**

```svelte
<script lang="ts">
	import Stage from '$lib/components/Stage.svelte';
	import { stages } from '$lib/content';
</script>

<svelte:head>
	<title>( contact ) — parentesi</title>
</svelte:head>

<Stage spec={stages.contact} credit="Photos: Fredericke Alma Sauerbrey, Zoe Spawton">
	<div class="row rise" style="--d: 100ms">
		<span class="big left" aria-hidden="true">(</span>
		<div class="block reveal">
			<a href="mailto:parentesi.berlin@gmail.com">parentesi.berlin@gmail.com</a>
			<a href="tel:+393408732532">+39 340 873 2532</a>
			<!-- Instagram handle TBC with owner; placeholder points at Planatia -->
			<a class="secondary" href="https://www.instagram.com/planatia/" rel="external">instagram</a>
			<p class="secondary place">Berlin · itinerant</p>
		</div>
		<span class="big right" aria-hidden="true">)</span>
	</div>
</Stage>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: 56px;
	}
	.big {
		font-size: 440px;
		line-height: 1;
		transform: translateY(-4%);
		animation: 1100ms var(--ease-paren) 300ms both;
	}
	.left {
		animation-name: from-right;
	}
	.right {
		animation-name: from-left;
	}
	@keyframes from-right {
		from {
			transform: translateY(-4%) translateX(200px);
		}
	}
	@keyframes from-left {
		from {
			transform: translateY(-4%) translateX(-200px);
		}
	}
	.block {
		display: flex;
		flex-direction: column;
		gap: 22px;
		align-items: center;
		font-size: 22px;
		line-height: 1.4;
		letter-spacing: 0.04em;
	}
	.block p {
		margin: 0;
	}
	.secondary {
		font-size: 15px;
		letter-spacing: 0.14em;
	}
	.place {
		margin-top: 10px !important;
	}

	@media (prefers-reduced-motion: reduce) {
		.big {
			animation: none;
		}
	}

	@media (max-width: 1023px) {
		.row {
			flex-direction: column;
			gap: 8px;
		}
		.big {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 240px;
			height: 120px;
			font-size: 200px;
			transform: none;
		}
		.left {
			transform: rotate(90deg);
			animation-name: from-below;
		}
		.right {
			transform: rotate(90deg);
			animation-name: from-above;
		}
		@keyframes from-below {
			from {
				transform: rotate(90deg) translateX(130px);
			}
		}
		@keyframes from-above {
			from {
				transform: rotate(90deg) translateX(-130px);
			}
		}
		.block {
			gap: 18px;
			padding: 24px 0;
			font-size: 17px;
			letter-spacing: 0.03em;
		}
		.secondary {
			font-size: 13px;
			letter-spacing: 0.12em;
		}
	}
</style>
```

(Rotated-paren note: with `rotate(90deg)` applied, a translateX in the same transform list moves along the rotated axis — i.e. vertically — which is exactly the "from above / from below" entrance the handoff describes.)

- [ ] **Step 3: Verify in dev**

`npm run check` → 0 errors. Browser: music page darker (filter + heavier scrim), SoundCloud player loads inside the ecru border, links underline-hover; contact shows the giant parens desktop, rotated brackets above/below on mobile; credit includes Zoe Spawton.

- [ ] **Step 4: Commit**

```bash
git add src/routes/music src/routes/contact && git commit -m "feat: music teaser and contact routes"
```

---

### Task 9: Full verification pass

**Files:** none new — fixes only.

- [ ] **Step 1: Run the whole suite**

```bash
npm run check && npm run lint && npm test && npm run build
```

Expected: all clean. Fix anything that isn't (prettier via `npm run format`).

- [ ] **Step 2: Browser pass, desktop** — with the dev server and Browser pane:
  - `/`: exactly one photo visible at load; dissolves every ~7s with 2s fades; no flash of the dark base between photos; wheel scroll visibly accelerates and eases back over ~1.5s.
  - Nav: closed reads as a compact `( )`; open spreads to `( food  music  contact )` with staggered fades; content behind dims; Esc and outside-click close; parens navigate home; current route link dimmed and unclickable. Adjust the Nav `--travel`/width CSS if the closed/open geometry doesn't match the boards.
  - `/food` two columns; `/music` darker with working embed; `/contact` giant parens optically centered.

- [ ] **Step 3: Browser pass, mobile (390×844 emulation)** — wordmark on one line; nav open spans the width with ≥44px targets; food text scrolls inside its masked frame (page never moves) and swiping accelerates the crossfade; contact brackets sit above and below the block; side padding 28px everywhere; no horizontal scroll.

- [ ] **Step 4: Reduced-motion pass** — emulate `prefers-reduced-motion: reduce`: hard cuts every 7s, no entrance animation, nav opens instantly.

- [ ] **Step 5: Commit fixes**

```bash
git add -A && git commit -m "fix: visual polish from verification pass"
```

**Do NOT `git push` at any point** — the owner reviews locally first and pushes after sign-off.

---

## Out of scope / follow-ups (do not build now)

- Swapping the Food stage to the daylight `3H6A*.jpg` series and Contact to the Zoe Spawton series (owner to pick; add slugs to `scripts/optimize-images.mjs` + `content.ts` when chosen).
- Real menu dishes 2–5 and the ( parentesi ) Instagram handle (placeholders flagged in code comments).
- Deployment to Vercel (adapter already configured).
- OG image / social meta beyond the description tag.
