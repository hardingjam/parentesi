<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import Nav from '$lib/components/Nav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta
		name="description"
		content="( parentesi ) — a suspended moment. Plant-based dining, catering, workshops and itinerant events by chef Pietro Platania, Berlin."
	/>
</svelte:head>

<!-- Remount route content on navigation so entrance animations replay once per route load. -->
{#key page.url.pathname}
	{@render children()}
{/key}
<Nav current={page.url.pathname} />
