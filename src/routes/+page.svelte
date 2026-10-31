<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import PhotoStack from '$lib/components/PhotoStack.svelte';
	import Contact from '$lib/sections/Contact.svelte';
	import Food from '$lib/sections/Food.svelte';
	import Home from '$lib/sections/Home.svelte';
	import Music from '$lib/sections/Music.svelte';
	import { sections, stages, type Section } from '$lib/content';
	import { glide } from '$lib/scroll.svelte';

	// Scroll spy: the section crossing the viewport's midline is current.
	// During a nav glide the nav names the destination at once, while the
	// photo reel holds until arrival; if the user breaks off the glide, both
	// fall back to the section actually in view.
	let current: Section = $state('home');
	const named = $derived(glide.target ?? current);
	let photoSection: Section = $state('home');
	$effect(() => {
		if (!glide.target) photoSection = current;
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
<Nav current={named} />
