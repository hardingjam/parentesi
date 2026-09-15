<script lang="ts">
	import { srcset, stagePhotos, type StageSpec } from '$lib/content';
	import {
		SECONDS_PER_PHOTO,
		crossfadeKeyframes,
		cycleSeconds,
		photoDelaySeconds
	} from '$lib/stage/crossfade';

	// The route's treatment (scrim, filter) changes on navigation; the photo
	// reel itself is mounted once in the layout and never restarts. Nothing
	// the user does — scrolling, opening the nav — affects its pace.
	let { spec }: { spec: StageSpec } = $props();

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

		return () => {
			for (const animation of animations) animation.cancel();
		};
	});
</script>

<div class="backdrop" style="--scrim-d: {spec.scrimDesktop}; --scrim-m: {spec.scrimMobile}">
	<div class="stack" bind:this={stack}>
		{#each stagePhotos as photo, i (photo.slug)}
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
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		overflow: hidden;
		background: var(--base);
	}
	.stack,
	.scrim {
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
		/* Route changes retune the filter (music darkens); ease it so the
		   continuous reel never visibly jumps. */
		transition: filter 600ms;
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

	@media (max-width: 1023px) {
		.scrim {
			background: var(--scrim-m);
		}
	}
</style>
