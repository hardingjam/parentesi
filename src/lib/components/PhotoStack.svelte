<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import { srcset, type StagePhoto, type StageSpec } from '$lib/content';
	import { FADE_MS, HOLD_MS } from '$lib/stage/crossfade';

	// The site's ambient slideshow: a double-buffered pair of layers that
	// dissolve into each other on a fixed clock. Mounted once, fixed behind
	// the scrolling page; the section in view only switches which photo
	// GROUP plays (dissolving into the new group, never hard-cutting), and
	// nothing the user does — scrolling, opening the nav — affects its pace.
	let { spec }: { spec: StageSpec } = $props();

	interface Layer {
		photo: StagePhoto | null;
		shown: boolean;
	}

	// Layer 0 starts with the entry section's first photo so it is part of the
	// server-rendered HTML — no blank frame before hydration. Reading spec's
	// INITIAL value here is deliberate: later group changes flow through the
	// $effect below, not through re-initialization.
	// svelte-ignore state_referenced_locally
	const entryGroup = spec.group;
	let layers: [Layer, Layer] = $state([
		{ photo: entryGroup.photos[0], shown: true },
		{ photo: null, shown: false }
	]);
	let front = $state(0);
	const els: (HTMLImageElement | undefined)[] = [undefined, undefined];

	let groupId = entryGroup.id;
	let photoIndex = 0;
	let generation = 0;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let instant = $state(false); // prefers-reduced-motion: hard cuts, same clock

	async function showNext(target?: number) {
		const gen = ++generation;
		clearTimeout(timer);
		const group = spec.group;
		photoIndex = target ?? (photoIndex + 1) % group.photos.length;
		const back = 1 - front;
		layers[back] = { photo: group.photos[photoIndex], shown: false };
		await tick();
		const el = els[back];
		if (el) {
			// Never fade to a half-loaded image; if decode fails, show anyway.
			try {
				await el.decode();
			} catch {
				/* ignore */
			}
		}
		// Let the browser paint the new layer at opacity 0 first — a cached
		// image can decode within the mount frame, and flipping `shown` in
		// that same frame would skip the transition (hard cut, no dissolve).
		await new Promise(requestAnimationFrame);
		await new Promise(requestAnimationFrame);
		if (gen !== generation) return;
		layers[back] = { ...layers[back], shown: true };
		timer = setTimeout(
			() => {
				if (gen !== generation) return;
				// The old front is fully covered now — unmount it silently.
				layers[front] = { photo: null, shown: false };
				front = back;
				timer = setTimeout(() => showNext(), HOLD_MS);
			},
			instant ? 0 : FADE_MS
		);
	}

	let started = false;
	$effect(() => {
		const id = spec.group.id; // reactive: reruns on section/group change
		if (!started) {
			started = true;
			instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			timer = setTimeout(() => showNext(), HOLD_MS);
		} else if (id !== groupId) {
			groupId = id;
			showNext(0);
		}
	});

	onDestroy(() => {
		generation++;
		clearTimeout(timer);
	});
</script>

<div class="backdrop" style="--scrim-d: {spec.scrimDesktop}; --scrim-m: {spec.scrimMobile}">
	<div class="stack">
		{#each layers as layer, i (i)}
			{#if layer.photo}
				<img
					bind:this={els[i]}
					srcset={srcset(layer.photo.slug)}
					sizes="100vw"
					alt={layer.photo.alt}
					style:filter={spec.filter}
					class:shown={layer.shown}
					class:incoming={i !== front}
					class:instant
					decoding="async"
				/>
			{/if}
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
		/* Guaranteed stacking context so the layers' z-index can never paint
		   above the page content. */
		isolation: isolate;
	}
	.stack,
	.scrim {
		position: absolute;
		inset: 0;
	}
	.stack {
		/* Contain the layers' z-index INSIDE the stack: without this, the
		   incoming layer's z-index lifted it above the sibling scrim while
		   dissolving, so photos faded in undimmed and the scrim "snapped"
		   on when the fade finished. */
		isolation: isolate;
	}
	.stack img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		/* opacity duration must match FADE_MS in $lib/stage/crossfade. The
		   filter ease keeps the music section's darkening from jumping. */
		transition:
			opacity 1000ms linear,
			filter 600ms;
	}
	.stack img.shown {
		opacity: 1;
	}
	/* The dissolving-in layer always paints above the current one. */
	.stack img.incoming {
		z-index: 1;
	}
	.stack img.instant {
		transition: filter 600ms;
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
