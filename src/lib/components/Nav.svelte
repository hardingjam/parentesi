<script lang="ts">
	import type { Section } from '$lib/content';
	import { closeNav, nav, toggleNav } from '$lib/nav.svelte';
	import { glideTo } from '$lib/scroll.svelte';

	// `current` is the section in view (the page's scroll spy).
	let { current }: { current: Section } = $props();

	const links = ['home', 'food', 'music', 'contact'] as const;

	// The mark always names the section in view: `( food )` closed, the
	// full `( home food music contact )` row open. The slot between the
	// parens animates between the two measured widths (the brand face isn't
	// monospace), so the closing paren glides out, and on phones, where the
	// nav is centred, both parens spread evenly. Until the first measurement
	// lands (SSR), the slot sizes to the in-flow label on its own.
	let labelWidth = $state(0);
	let linksWidth = $state(0);
	const slotWidth = $derived(nav.open ? linksWidth : labelWidth);
	// Phones stack the mark vertically (see the CSS); there the slot's
	// height opens from one line to the measured list instead.
	let linksHeight = $state(0);

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

	// The links glide to their section (see glideTo) instead of the
	// browser's instant/native-smooth hash jump.
	function go(e: MouseEvent, id: Section) {
		e.preventDefault();
		closeNav();
		glideTo(id);
	}

	// Shared by both parens and the label between them.
	function onParenClick(e: MouseEvent) {
		// Hover already opened the nav, or a touch tap on the open mark: a
		// paren click is just "go home". Otherwise a tap opens the menu.
		if (hoverIntent() || nav.open) {
			go(e, 'home');
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
	onkeydown={onKeydown}
	onpointerdown={onWindowPointerDown}
	onpointermove={onPointerEvent}
/>

<!-- Blurs the page behind the open menu so it reads (a touch on desktop,
     more on phones, where the menu sits over the copy). -->
<div class="veil" class:open={nav.open} aria-hidden="true"></div>

<nav
	bind:this={navElement}
	class:open={nav.open}
	aria-label="site"
	onmouseenter={onMouseEnter}
	onmouseleave={onMouseLeave}
	onfocusin={onFocusIn}
	onfocusout={onFocusOut}
>
	<a
		class="paren"
		href="#home"
		aria-label={nav.open ? 'home' : 'open menu'}
		aria-expanded={nav.open}
		onclick={onParenClick}>(</a
	>
	<div
		class="slot"
		style:width={slotWidth ? `${slotWidth}px` : undefined}
		style:--open-h={nav.open && linksHeight ? `${linksHeight}px` : undefined}
	>
		<!-- Visual twin of the parens' "open menu" (so tapping the word works
		     on phones too); the current section is announced via the links'
		     aria-current. -->
		<button
			type="button"
			class="label"
			tabindex="-1"
			aria-hidden="true"
			bind:clientWidth={labelWidth}
			onclick={onParenClick}>{current}</button
		>
		<div
			class="links"
			bind:clientWidth={linksWidth}
			bind:clientHeight={linksHeight}
			aria-hidden={!nav.open}
		>
			{#each links as id, i (id)}
				{@const isCurrent = current === id}
				<a
					href="#{id}"
					style="--i: {i}"
					aria-current={isCurrent ? 'location' : undefined}
					tabindex={nav.open && !isCurrent ? undefined : -1}
					onclick={(e) => go(e, id)}>{id}</a
				>
			{/each}
		</div>
	</div>
	<a
		class="paren"
		href="#home"
		aria-label={nav.open ? 'home' : 'open menu'}
		aria-expanded={nav.open}
		onclick={onParenClick}>)</a
	>
</nav>

<style>
	/* Breakpoint geometry lives in media queries so first paint on a phone
	   is already right; only the slot's width (desktop) and open height
	   (phones) come from JS, as measured text. */
	nav {
		position: fixed;
		top: 40px;
		left: 48px;
		z-index: 30;
		height: 56px;
		display: flex;
		align-items: center;
	}

	@media (max-width: 1023px) {
		nav {
			top: 56px;
			left: 24px;
			height: auto;
			flex-direction: column;
			align-items: flex-start;
		}
	}

	.paren {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 56px;
		min-height: 56px;
		font-size: 26px;
		letter-spacing: 0.15em;
		cursor: pointer;
		transition: opacity 200ms;
	}

	@media (max-width: 1023px) {
		.paren {
			min-width: 44px;
			min-height: 44px;
			font-size: 28px;
		}
	}

	.paren:hover {
		opacity: 0.7;
	}

	.slot {
		position: relative;
		align-self: stretch;
		/* Tuck the text a little into the parens' hit boxes (whose centred
		   glyphs carry ~20px of air) so ( food ) reads as one word. */
		margin: 0 -5px;
		transition: width 320ms var(--ease-paren);
	}

	@media (max-width: 1023px) {
		.slot {
			margin: 0 -4px;
		}
	}

	/* Label and links share one type style so nothing resizes as one
	   dissolves into the other. width: max-content keeps their measured
	   widths independent of the (animating) slot. */
	.label,
	.links a {
		font-size: 26px;
		letter-spacing: 0.15em;
		white-space: nowrap;
	}

	.label {
		display: flex;
		align-items: center;
		width: max-content;
		height: 100%;
		cursor: pointer;
		transition:
			opacity 200ms,
			visibility 200ms;
	}

	nav.open .label {
		opacity: 0;
		visibility: hidden;
	}

	.links {
		position: absolute;
		top: 0;
		left: 0;
		width: max-content;
		height: 100%;
		display: flex;
		align-items: center;
		gap: 40px;
		pointer-events: none;
	}

	nav.open .links {
		pointer-events: auto;
	}

	.links a {
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 200ms,
			visibility 200ms;
	}

	/* Open state: the CURRENT section reads at full strength, the other
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

	nav.open .links a[aria-current] {
		opacity: 1;
		pointer-events: none;
	}

	.veil {
		position: fixed;
		inset: 0;
		z-index: 29;
		pointer-events: none;
		-webkit-backdrop-filter: blur(0);
		backdrop-filter: blur(0);
		transition:
			-webkit-backdrop-filter 300ms,
			backdrop-filter 300ms;
	}
	.veil.open {
		-webkit-backdrop-filter: blur(4px);
		backdrop-filter: blur(4px);
	}

	/* Phones and tablets: a vertical mark in the top-left corner. Closed,
	   it's just the parens on their side (︵ ︶), stacked close; opening
	   slides the lower one down as the slot grows to the stacked list
	   (h2-size links), over a blurred page. */
	@media (max-width: 1023px) {
		.paren {
			transform: rotate(90deg);
		}
		.slot {
			/* Closed, the slot is empty and the paren boxes overlap, leaving
			   ~20px between the arcs' tips. */
			margin: -8px 0;
			height: var(--open-h, 0px);
			transition:
				width 320ms var(--ease-paren),
				height 500ms var(--ease-paren);
			/* Links below the lower paren stay hidden while it moves; the
			   margin keeps the text's soft shadow. */
			overflow-y: clip;
			overflow-clip-margin: 12px;
		}
		.links a {
			font-size: var(--text-lg);
			letter-spacing: 0;
			min-height: 44px;
		}
		/* The page name only shows in the open list on phones. */
		.label {
			display: none;
		}
		.links {
			flex-direction: column;
			align-items: flex-start;
			gap: 0;
			height: auto;
		}
		.links a {
			display: inline-flex;
			align-items: center;
		}
		nav.open .links a {
			/* Each link appears as the lower paren passes it. */
			transition-delay: calc(100ms + var(--i) * 90ms);
		}

		.veil.open {
			-webkit-backdrop-filter: blur(14px);
			backdrop-filter: blur(14px);
		}
	}
</style>
