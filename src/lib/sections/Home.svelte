<script lang="ts">
	import Stage from '$lib/components/Stage.svelte';

	const services = [
		'circular plant-based dining',
		'tailor-made catering',
		'itinerant experiences',
		'cooking workshops',
		'food consulting'
	];
</script>

<Stage id="home">
	<!-- Phones: three snapped screens, one per panel. Desktop: one screen
	     (the panels are display: contents). -->
	<div class="panel">
		<h1 class="wordmark rise" style="--d: 100ms" aria-label="parentesi">
			<span>(</span><span class="gap"><span class="letters">&nbsp;p a r e n t e s i&nbsp;</span></span
			><span>)</span>
		</h1>
		<p class="manifesto body rise" style="--d: 3600ms">
			A suspended moment where gastronomy, music, art and conscious consumption create an inspiring
			dialogue.
		</p>
	</div>
	<div class="panel">
		<p class="manifesto unity body rise" style="--d: 3600ms">
			We believe in food as unity, a form of cultural connection and discovery within a sensory
			dimension.
		</p>
	</div>
	<div class="panel">
		<ul class="services body list rise" style="--d: 3800ms">
			{#each services as service (service)}
				<li>{service}</li>
			{/each}
		</ul>
	</div>
</Stage>

<style>
	.wordmark {
		display: flex;
		align-items: baseline;
		margin-bottom: var(--space-5);
		/* 64px at ≥1440px, scaling down so the unwrappable letter-spaced
		   wordmark always fits the 160px-padded column. It's ~17 font-sizes
		   wide; 17.5 leaves room for a classic scrollbar. Any tighter and
		   the opened gap squeezes, sliding "i" under ")" (it did at
		   1024–1250px with the old 4.4vw). */
		font-size: min(64px, calc((100vw - 320px) / 17.5));
		font-weight: 400;
		line-height: 1;
		letter-spacing: 0.32em;
		white-space: pre;
	}
	/* The intro: a closed ( ) fades in, then opens slowly and evenly
	   (0.7s → 2.3s) as the gap between the parens grows from nothing to the
	   word's width (a 0fr → 1fr grid column, so it needs no measuring).
	   Only then does "parentesi" appear, and the title holds alone for
	   ~0.7s before the copy rises in. */
	.gap {
		display: grid;
		grid-template-columns: 1fr;
		animation: open 1600ms cubic-bezier(0.45, 0, 0.25, 1) 700ms both;
	}
	@keyframes open {
		from {
			grid-template-columns: 0fr;
		}
	}
	.letters {
		/* Lets the column close to 0 (the word, still invisible, overflows). */
		min-width: 0;
		animation: appear 600ms var(--ease-entrance) 2300ms both;
	}
	@keyframes appear {
		from {
			opacity: 0;
		}
	}
	.panel {
		display: contents;
	}
	.manifesto {
		max-width: 700px;
	}
	.unity {
		margin-top: var(--space-2);
	}
	.services {
		margin-top: var(--space-4);
	}

	@media (prefers-reduced-motion: reduce) {
		.gap,
		.letters {
			animation: none;
		}
	}

	@media (max-width: 1023px) {
		.wordmark {
			/* 24px, scaling down on phones narrower than ~400px so the word
			   always fits between the parens. At 24px it's 337px wide, ~14
			   font-sizes; the column is the viewport minus 2 × 28px padding.
			   Too wide, the opened gap squeezed and the word slid under ")". */
			font-size: min(24px, calc((100vw - 56px) / 14.5));
			letter-spacing: 0.18em;
		}
		/* Each panel is a screen that snaps flush to the top (the page sets
		   scroll-snap-type in layout.css), so the panels carry the stage's
		   vertical padding instead of the stage. snap-stop: a fling still
		   stops at every panel. */
		:global(#home) {
			padding-block: 0;
		}
		.panel {
			min-height: 100svh;
			padding: 140px 0 100px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			scroll-snap-align: start;
			scroll-snap-stop: always;
		}
		.unity,
		.services {
			margin-top: 0;
		}
	}
</style>
