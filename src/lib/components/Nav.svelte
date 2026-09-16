<script lang="ts">
	import { resolve } from '$app/paths';
	import { closeNav, nav, toggleNav } from '$lib/nav.svelte';

	let { current }: { current: string } = $props();

	const routes = [
		{ href: resolve('/food'), label: 'food' },
		{ href: resolve('/music'), label: 'music' },
		{ href: resolve('/contact'), label: 'contact' }
	] as const;

	let viewportWidth = $state(typeof window !== 'undefined' ? window.innerWidth : 1440);
	// Natural width of the "food music contact" row, measured live so the
	// closing paren's travel distance always trails the *actual* rendered
	// content (never overlapping it) regardless of font metrics. On mobile
	// this is additionally clamped by `maxLinksWidth` below, so the measured
	// value here saturates at whatever room is actually available. 320 is
	// just a first-paint guess before the real measurement lands.
	let linksContentWidth = $state(320);

	const isMobile = $derived(viewportWidth <= 1023);
	const edge = $derived(isMobile ? 24 : 48);
	const parenSize = $derived(isMobile ? 44 : 56);
	const linkGap = $derived(isMobile ? 10 : 40);
	// Small on both breakpoints: the closing paren's glyph is centered inside
	// its ≥44px hit box, which already contributes ~15px of visual air — a
	// full linkGap here made ") contact" read much wider than "( food".
	const trailingGap = 8;
	// On a narrow phone there isn't always room for the full link row
	// between the parens' hit areas and the screen edges, so on mobile the
	// links are capped (and clipped) to whatever room is actually
	// available. Combined with `openDistance` below (which is always driven
	// by the *measured* — and therefore clamped — width), this guarantees
	// the closing paren can never overlap the link text AND never lands
	// past the true right edge, at any viewport width.
	const maxLinksWidth = $derived(
		isMobile ? Math.max(viewportWidth - edge * 2 - parenSize * 2 - trailingGap, 0) : Infinity
	);
	// Distance the closing paren travels when the nav opens, i.e. how far
	// past the opening paren's hit area it rests.
	const openDistance = $derived(linksContentWidth + trailingGap);

	// Closed, the mark doubles as the page heading: `( food )` on /food.
	// Home shows the bare `( )`. The label's measured width pushes the
	// closing paren out just far enough; 0 (empty label) collapses it.
	const currentLabel = $derived(routes.find((route) => route.href === current)?.label ?? '');
	let currentLabelWidth = $state(0);
	const closedDistance = $derived(currentLabel ? currentLabelWidth + trailingGap : 0);

	// Mouse users: the nav opens when the pointer enters it and closes when
	// it leaves; the parens are then plain home links. Touch input (phones,
	// AND taps on hover-capable touch-screen laptops): tapping the mark
	// toggles instead — tap to open, tap outside to close, tap a paren again
	// to go home. Media queries can't tell a touch-screen laptop's tap from
	// its mouse, so the last pointer's type is tracked per event instead:
	// pointerdown fires before the tap's synthesized mouseenter/click, and
	// pointermove flips it back to 'mouse' the moment the mouse moves.
	const hoverCapable = () => window.matchMedia('(hover: hover)').matches;
	let lastPointerType = 'mouse';
	const hoverIntent = () => hoverCapable() && lastPointerType !== 'touch';

	function onPointerEvent(e: PointerEvent) {
		if (e.pointerType) lastPointerType = e.pointerType;
	}

	function onMouseEnter() {
		if (hoverIntent()) nav.open = true;
	}

	function onMouseLeave() {
		if (hoverIntent()) closeNav();
	}

	// Keyboard access: tabbing into the nav opens it, tabbing out closes it.
	// (Guarded like hover so a touch tap's focus event can't fight the
	// tap-to-toggle click handler below.)
	function onFocusIn() {
		if (hoverIntent()) nav.open = true;
	}

	function onFocusOut(e: FocusEvent) {
		if (hoverIntent() && !(e.currentTarget as Node).contains(e.relatedTarget as Node)) {
			closeNav();
		}
	}

	// The parens are single, persistent elements across open/close (never
	// swapped between <a> and <button>) so the CSS transform transition has
	// something to interpolate from and actually animates.
	function onParenClick(e: MouseEvent) {
		if (hoverIntent()) {
			// Hover already opened the nav; a paren click is just "go home".
			closeNav();
			return;
		}
		if (nav.open) {
			closeNav();
		} else {
			e.preventDefault();
			toggleNav();
		}
	}

	// Touch has no Esc and no mouseleave: a tap anywhere outside the open
	// nav dismisses it without navigating.
	function onWindowPointerDown(e: PointerEvent) {
		onPointerEvent(e);
		if (nav.open && !navElement?.contains(e.target as Node)) closeNav();
	}

	let navElement: HTMLElement | undefined = $state();

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') closeNav();
	}
</script>

<svelte:window
	bind:innerWidth={viewportWidth}
	onkeydown={onKeydown}
	onpointerdown={onWindowPointerDown}
	onpointermove={onPointerEvent}
/>

<nav
	bind:this={navElement}
	class:open={nav.open}
	aria-label="site"
	onmouseenter={onMouseEnter}
	onmouseleave={onMouseLeave}
	onfocusin={onFocusIn}
	onfocusout={onFocusOut}
>
	<div class="row">
		<a
			class="paren"
			href={resolve('/')}
			aria-label={nav.open ? 'home' : 'open menu'}
			aria-expanded={nav.open}
			onclick={onParenClick}>(</a
		>
		{#if currentLabel}
			<span
				class="current-label"
				style="left: {parenSize}px"
				bind:clientWidth={currentLabelWidth}
				aria-hidden={nav.open}>{currentLabel}</span
			>
		{/if}
		<div
			class="links"
			style="left: {parenSize}px; max-width: {isMobile
				? `${maxLinksWidth}px`
				: 'none'}; gap: {linkGap}px"
			bind:clientWidth={linksContentWidth}
			aria-hidden={!nav.open}
		>
			{#each routes as route, i (route.href)}
				{@const isCurrent = current === route.href}
				<a
					href={route.href}
					style="--i: {i}"
					aria-current={isCurrent ? 'page' : undefined}
					tabindex={nav.open && !isCurrent ? undefined : -1}
					onclick={closeNav}>{route.label}</a
				>
			{/each}
		</div>
		<a
			class="paren closing"
			href={resolve('/')}
			style="transform: translateX({nav.open ? openDistance : closedDistance}px)"
			aria-label={nav.open ? 'home' : 'open menu'}
			aria-expanded={nav.open}
			onclick={onParenClick}>)</a
		>
	</div>
</nav>

<style>
	/* Geometry that's purely a breakpoint concern (position, sizing, type)
	   lives in real media queries so first paint on a phone is already
	   correct — no waiting on JS hydration to read window.innerWidth and
	   flip a class, which would otherwise flash desktop geometry first. Only
	   values that genuinely need live measurement (linksContentWidth,
	   maxLinksWidth, openDistance, and the gap that feeds openDistance's
	   math — see script) stay in JS, and those only matter once the nav is
	   opened, which is inherently post-hydration anyway. */
	nav {
		position: fixed;
		top: 40px;
		left: 48px;
		z-index: 30;
		height: 56px;
	}

	@media (max-width: 1023px) {
		nav {
			top: 56px;
			left: 24px;
			height: 44px;
		}
	}

	.row {
		position: relative;
		display: flex;
		align-items: center;
		height: 100%;
	}

	.paren {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 56px;
		min-height: 56px;
		padding: 0;
		margin: 0;
		border: none;
		background: none;
		font: inherit;
		font-size: 26px;
		letter-spacing: 0.15em;
		color: var(--ecru);
		cursor: pointer;
		text-decoration: none;
		transition: opacity 200ms;
	}

	@media (max-width: 1023px) {
		.paren {
			min-width: 44px;
			min-height: 44px;
			font-size: 22px;
		}
	}

	.paren:hover {
		opacity: 0.7;
	}

	.paren.closing {
		position: relative;
		transition:
			transform 320ms var(--ease-paren),
			opacity 200ms;
	}

	/* Closed-state page heading between the parens: `( food )`. Typography
	   matches the open-state links so the label doesn't resize when the
	   route list dissolves into its place. */
	.current-label {
		position: absolute;
		top: 0;
		height: 100%;
		display: flex;
		align-items: center;
		white-space: nowrap;
		font-size: 26px;
		letter-spacing: 0.15em;
		pointer-events: none;
		transition: opacity 200ms;
	}

	nav.open .current-label {
		opacity: 0;
	}

	@media (max-width: 1023px) {
		.current-label {
			font-size: 18px;
			letter-spacing: 0.06em;
		}
	}

	.links {
		position: absolute;
		top: 0;
		height: 100%;
		display: flex;
		align-items: center;
		overflow: hidden;
		pointer-events: none;
		/* gap is set inline from the same `linkGap` value that feeds
		   `openDistance`'s math (see script) — one source of truth instead
		   of a second hardcoded literal here that could drift from it. */
	}

	nav.open .links {
		pointer-events: auto;
	}

	.links a {
		font-size: 26px;
		letter-spacing: 0.15em;
		white-space: nowrap;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 200ms,
			visibility 200ms;
	}

	@media (max-width: 1023px) {
		.links a {
			/* The handoff's 22px/.12em genuinely can't fit "food music contact"
			   between two 44px parens at 360-390px — it ellipsis-clipped the
			   labels. Readable beats clipped, so the open row runs smaller and
			   tighter on phones. */
			font-size: 18px;
			letter-spacing: 0.06em;
			min-height: 44px;
			display: inline-flex;
			align-items: center;
			/* Let flexbox actually shrink (and clip, with an ellipsis) each
			   link's own box to fit `.links`' clamped max-width, instead of
			   relying on the ancestor's overflow:hidden to visually hide an
			   overflowing tail — that left the anchor's own hit-tested/
			   measured box wider than what's rendered, which read as
			   overlapping the closing paren under a raw bounding-box check
			   even though nothing was actually visible or clickable there. */
			min-width: 0;
			flex-shrink: 1;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	/* Open state: the CURRENT route reads at full strength, the other
	   destinations sit dimmer until pointed at. */
	nav.open .links a {
		opacity: 0.55;
		visibility: visible;
		transition-delay: calc(120ms + var(--i) * 60ms);
	}

	nav.open .links a:hover,
	nav.open .links a:focus-visible {
		opacity: 1;
		/* The stagger delay is an entrance effect only — hover feedback
		   must be immediate. */
		transition-delay: 0ms;
	}

	nav.open .links a[aria-current='page'] {
		opacity: 1;
		pointer-events: none;
	}
</style>
