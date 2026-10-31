<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>( parentesi )</title>
	<link rel="icon" href={favicon} />
	<meta
		name="description"
		content="( parentesi ) — a suspended moment. Plant-based dining, catering, workshops and itinerant events by chef Pietro Platania, Berlin."
	/>
</svelte:head>

{@render children()}
