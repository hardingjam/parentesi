<script lang="ts">
	import type { Snippet } from 'svelte';
	import { nav } from '$lib/nav.svelte';

	// Content shell for a route: centered copy, nav dimming.
	// The photo reel behind it lives in the layout (PhotoStack) so it never
	// restarts on navigation.
	let { children }: { children: Snippet } = $props();
</script>

<div class="stage">
	<div class="content" class:dimmed={nav.open}>
		{@render children()}
	</div>
</div>

<style>
	.stage {
		position: fixed;
		inset: 0;
		overflow: hidden;
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

	@media (max-width: 1023px) {
		.content {
			padding: 0 28px;
		}
	}
</style>
