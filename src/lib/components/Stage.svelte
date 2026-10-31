<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Section } from '$lib/content';
	import { nav } from '$lib/nav.svelte';

	// One full-screen section of the scrolling page: centered copy over the
	// fixed photo reel (PhotoStack, in the page), dimmed while the nav is open.
	let { id, children }: { id: Section; children: Snippet } = $props();
</script>

<section {id} class="stage" class:dimmed={nav.open}>
	{@render children()}
</section>

<style>
	.stage {
		/* Above the fixed reel, which comes earlier in the DOM. */
		position: relative;
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 140px 160px;
		transition: opacity 200ms;
	}
	.stage.dimmed {
		opacity: 0.35;
	}

	@media (max-width: 1023px) {
		.stage {
			padding: 140px 28px 100px;
		}
	}
</style>
