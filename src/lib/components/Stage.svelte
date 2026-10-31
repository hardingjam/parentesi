<script lang="ts">
	import type { Snippet } from 'svelte';
	import { nav } from '$lib/nav.svelte';

	// Content shell for a route: centered copy, nav dimming.
	// The photo reel behind it lives in the layout (PhotoStack) so it never
	// restarts on navigation.
	let {
		corner,
		children
	}: {
		corner?: string;
		children: Snippet;
	} = $props();
</script>

<div class="stage">
	<div class="content" class:dimmed={nav.open}>
		{@render children()}
	</div>
	{#if corner}
		<p class="corner">{corner}</p>
	{/if}
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
	.corner {
		position: absolute;
		bottom: 36px;
		right: 48px;
		margin: 0;
		font-size: 12px;
		letter-spacing: 0.08em;
	}

	@media (max-width: 1023px) {
		.content {
			padding: 0 28px;
		}
		/* The corner note (home's "Berlin") is a desktop-only flourish per the
		   design handoff. */
		.corner {
			display: none;
		}
	}
</style>
