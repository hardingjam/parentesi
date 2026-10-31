<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import Nav from '$lib/components/Nav.svelte';
	import PhotoStack from '$lib/components/PhotoStack.svelte';
	import { stages, type StageSpec } from '$lib/content';

	let { children } = $props();

	// Keys are resolved like the nav's hrefs so route matching still works
	// if a base path is ever configured.
	const specByPath: Record<string, StageSpec> = {
		[resolve('/')]: stages.home,
		[resolve('/food')]: stages.food,
		[resolve('/music')]: stages.music,
		[resolve('/contact')]: stages.contact
	};
	const spec = $derived(specByPath[page.url.pathname] ?? stages.home);
</script>

<svelte:head>
	<title>( parentesi )</title>
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
