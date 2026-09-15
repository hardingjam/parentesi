<script lang="ts">
	import { closeNav, nav, toggleNav } from '$lib/nav.svelte';

	let { current }: { current: string } = $props();

	const routes = [
		{ href: '/food', label: 'food' },
		{ href: '/music', label: 'music' },
		{ href: '/contact', label: 'contact' }
	];

	let viewportWidth = $state(typeof window !== 'undefined' ? window.innerWidth : 1440);
	// Natural (unconstrained) width of the "food music contact" row, measured
	// live so the closing paren never overlaps the link text regardless of
	// font metrics. 320 is just a first-paint guess before the real
	// measurement lands.
	let linksContentWidth = $state(320);

	const isMobile = $derived(viewportWidth <= 1023);
	const edge = $derived(isMobile ? 24 : 48);
	const parenSize = $derived(isMobile ? 44 : 56);
	const linkGap = $derived(isMobile ? 12 : 40);
	// Distance the closing paren travels when the nav opens, i.e. how far past
	// the opening paren's hit area it rests. Desktop rests just past the
	// measured link content (design target ~330px). Mobile always spreads
	// exactly to the viewport edge (left/right edge inset on both sides) so
	// the open nav spans left-24 to right-24 and the closing paren never
	// lands off-screen.
	const openDistance = $derived(
		isMobile ? Math.max(viewportWidth - edge * 2 - parenSize * 2, 0) : linksContentWidth + linkGap
	);

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') closeNav();
	}
</script>

<svelte:window bind:innerWidth={viewportWidth} onkeydown={onKeydown} />

<nav class:open={nav.open} class:mobile={isMobile} aria-label="site">
	<div class="row">
		{#if nav.open}
			<a class="paren" href="/" onclick={closeNav} aria-label="home">(</a>
		{:else}
			<button class="paren" onclick={toggleNav} aria-label="open menu">(</button>
		{/if}
		<div
			class="links"
			style="left: {parenSize}px"
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
		{#if nav.open}
			<a
				class="paren closing"
				href="/"
				style="transform: translateX({openDistance}px)"
				onclick={closeNav}
				aria-label="home">)</a
			>
		{:else}
			<button
				class="paren closing"
				style="transform: translateX(0px)"
				onclick={toggleNav}
				aria-label="open menu">)</button
			>
		{/if}
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

	/* While open, hug the closing glyph to the outer edge of its hit area
	   instead of centering it, so it reads clear of the link text on narrow
	   mobile screens without changing the (still centered, already-compact)
	   closed-state look. */
	nav.open .paren.closing {
		justify-content: flex-end;
	}

	.links {
		position: absolute;
		top: 0;
		height: 100%;
		display: flex;
		align-items: center;
		gap: 40px;
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
