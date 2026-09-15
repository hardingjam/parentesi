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
	<div class="stack" bind:this={stack}>
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
	/* One photo painted before the WAAPI animations take over — their
	   negative delays put exactly one photo at full opacity immediately,
	   so nothing flashes on load. */
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
		/* The corner note (home's "Berlin") is a desktop-only flourish per the
		   design handoff; on narrow screens it would crowd the photo credit. */
		.corner {
			display: none;
		}
	}
</style>
