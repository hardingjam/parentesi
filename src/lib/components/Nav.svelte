<script lang="ts">
	import { closeNav, nav, toggleNav } from '$lib/nav.svelte';

	let { current }: { current: string } = $props();

	const routes = [
		{ href: '/food', label: 'food' },
		{ href: '/music', label: 'music' },
		{ href: '/contact', label: 'contact' }
	];

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
	const linkGap = $derived(isMobile ? 12 : 40);
	const trailingGap = $derived(isMobile ? 8 : linkGap);
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

	// The parens are single, persistent elements across open/close (never
	// swapped between <a> and <button>) so the CSS transform transition has
	// something to interpolate from and actually animates. Tapping either
	// one while open closes the nav and follows the href home; while closed,
	// the default navigation is suppressed and it just opens the nav.
	function onParenClick(e: MouseEvent) {
		if (nav.open) {
			closeNav();
		} else {
			e.preventDefault();
			toggleNav();
		}
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') closeNav();
	}
</script>

<svelte:window bind:innerWidth={viewportWidth} onkeydown={onKeydown} />

<nav class:open={nav.open} class:mobile={isMobile} aria-label="site">
	<div class="row">
		<a class="paren" href="/" aria-label={nav.open ? 'home' : 'open menu'} onclick={onParenClick}
			>(</a
		>
		<div
			class="links"
			style="left: {parenSize}px; max-width: {isMobile ? `${maxLinksWidth}px` : 'none'}"
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
			href="/"
			style="transform: translateX({nav.open ? openDistance : 0}px)"
			aria-label={nav.open ? 'home' : 'open menu'}
			onclick={onParenClick}>)</a
		>
	</div>
</nav>

<style>
	nav {
		position: fixed;
		top: 40px;
		left: 48px;
		z-index: 30;
		height: 56px;
	}

	nav.mobile {
		top: 56px;
		left: 24px;
		height: 44px;
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

	nav.mobile .paren {
		min-width: 44px;
		min-height: 44px;
		font-size: 22px;
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

	.links {
		position: absolute;
		top: 0;
		height: 100%;
		display: flex;
		align-items: center;
		gap: 40px;
		overflow: hidden;
		pointer-events: none;
	}

	nav.open .links {
		pointer-events: auto;
	}

	nav.mobile .links {
		gap: 12px;
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

	nav.mobile .links a {
		font-size: 22px;
		letter-spacing: 0.12em;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		/* Let flexbox actually shrink (and clip, with an ellipsis) each link's
		   own box to fit `.links`' clamped max-width, instead of relying on
		   the ancestor's overflow:hidden to visually hide an overflowing tail
		   — that left the anchor's own hit-tested/measured box wider than
		   what's rendered, which read as overlapping the closing paren under
		   a raw bounding-box check even though nothing was actually visible
		   or clickable there. */
		min-width: 0;
		flex-shrink: 1;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	nav.open .links a {
		opacity: 1;
		visibility: visible;
		transition-delay: calc(120ms + var(--i) * 60ms);
	}

	nav.open .links a[aria-current='page'] {
		opacity: 0.55;
		pointer-events: none;
		transition-delay: calc(120ms + var(--i) * 60ms);
	}
</style>
