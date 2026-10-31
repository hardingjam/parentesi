<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Section } from '$lib/content';

	// One full-screen section of the scrolling page: centered copy over the
	// fixed photo reel (PhotoStack, in the page).
	let { id, children }: { id: Section; children: Snippet } = $props();
</script>

<section {id} class="stage">
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
	}

	@media (max-width: 1023px) {
		.stage {
			padding: 140px 28px 100px;
		}
	}
</style>
