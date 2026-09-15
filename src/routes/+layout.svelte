<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import Nav from '$lib/components/Nav.svelte';
	import PhotoStack from '$lib/components/PhotoStack.svelte';
	import { stages, type StageSpec } from '$lib/content';

	let { children } = $props();

	const specByPath: Record<string, StageSpec> = {
		'/': stages.home,
		'/food': stages.food,
		'/music': stages.music,
		'/contact': stages.contact
	};
	const spec = $derived(specByPath[page.url.pathname] ?? stages.home);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta
		name="description"
		content="( parentesi ) — a suspended moment. Plant-based dining, catering, workshops and itinerant events by chef Pietro Platania, Berlin."
	/>
</svelte:head>

<!-- The photo reel sits OUTSIDE the route key: it crossfades continuously
     and never restarts on navigation — routes only retune its scrim/filter. -->
<PhotoStack {spec} />
<!-- Remount route content on navigation so entrance animations replay once
     per route load. -->
{#key page.url.pathname}
	{@render children()}
{/key}
<Nav current={page.url.pathname} />
