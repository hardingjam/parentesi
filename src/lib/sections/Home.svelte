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
	<h1 class="wordmark rise" style="--d: 100ms" aria-label="parentesi">
		<span>(</span><span class="gap"><span class="letters">&nbsp;p a r e n t e s i&nbsp;</span></span
		><span>)</span>
	</h1>
	<div class="manifesto body rise" style="--d: 3600ms">
		<p>
			A suspended moment where gastronomy, music, art and conscious consumption create an inspiring
			dialogue.
		</p>
		<p>
			We believe in food as unity, a form of cultural connection and discovery within a sensory
			dimension.
		</p>
	</div>
	<ul class="services body list rise" style="--d: 3800ms">
		{#each services as service (service)}
			<li>{service}</li>
		{/each}
	</ul>
</Stage>

<style>
	.wordmark {
		display: flex;
		align-items: baseline;
		margin: 0 0 88px;
		/* 64px at ≥1440px, scaling down so the unwrappable letter-spaced
		   wordmark never overflows the 160px-padded column at narrow
		   desktop widths (it was clipping at ~1024-1150px). */
		font-size: min(64px, 4.4vw);
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
	.manifesto {
		max-width: 700px;
	}
	.manifesto p {
		margin: 0;
	}
	.manifesto p + p {
		margin-top: 14px;
	}
	.services {
		margin-top: 44px;
	}

	@media (prefers-reduced-motion: reduce) {
		.gap,
		.letters {
			animation: none;
		}
	}

	@media (max-width: 1023px) {
		.wordmark {
			margin-bottom: 64px;
			/* 24px, scaling down on phones narrower than ~400px so the word
			   always fits between the parens. At 24px it's 337px wide, ~14
			   font-sizes; the column is the viewport minus 2 × 28px padding.
			   Too wide, the opened gap squeezed and the word slid under ")". */
			font-size: min(24px, calc((100vw - 56px) / 14.5));
			letter-spacing: 0.18em;
		}
		.manifesto p + p {
			margin-top: 12px;
		}
		.services {
			margin-top: 36px;
		}
	}
</style>
