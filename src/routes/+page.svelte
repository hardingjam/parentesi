<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import PhotoStack from '$lib/components/PhotoStack.svelte';
	import Contact from '$lib/sections/Contact.svelte';
	import Food from '$lib/sections/Food.svelte';
	import Home from '$lib/sections/Home.svelte';
	import Music from '$lib/sections/Music.svelte';
	import { sections, stages, type Section } from '$lib/content';
	import { glide } from '$lib/scroll.svelte';

	// Scroll spy: the section crossing the viewport's midline is current. It
	// is marked in the nav and retunes the one fixed photo reel, which holds
	// still while a nav glide passes through other sections and changes once,
	// on arrival.
	let current: Section = $state('home');
	let photoSection: Section = $state('home');
	$effect(() => {
		if (!glide.active) photoSection = current;
	});

	$effect(() => {
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) current = entry.target.id as Section;
				}
			},
			{ rootMargin: '-50% 0px -50% 0px' }
		);
		for (const id of sections) {
			const el = document.getElementById(id);
			if (el) io.observe(el);
		}
		return () => io.disconnect();
	});
</script>

<PhotoStack spec={stages[photoSection]} />
<main>
	<Home />
	<Food />
	<Music />
	<Contact />
</main>
<Nav {current} />
