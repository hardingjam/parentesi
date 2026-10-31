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
		<span class="paren left">(</span><span class="letters reveal"
			>&nbsp;p a r e n t e s i&nbsp;</span
		><span class="paren right">)</span>
	</h1>
	<div class="manifesto rise" style="--d: 3000ms">
		<p>
			A suspended moment where gastronomy, music, art and conscious consumption create an inspiring
			dialogue.
		</p>
		<p>
			We believe in food as unity, a form of cultural connection and discovery within a sensory
			dimension.
		</p>
	</div>
	<ul class="services rise" style="--d: 3200ms">
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
		--travel: 300px;
	}
	/* The intro: the parens open slowly and evenly (ease-in-out, not the
	   site's front-loaded paren ease, which read as a snap), the letters
	   reveal with them, then the title holds alone for ~1s before the copy
	   rises in. */
	.paren {
		animation: 1800ms cubic-bezier(0.45, 0, 0.25, 1) 300ms both;
	}
	.letters {
		animation-duration: 2200ms;
	}
	.left {
		animation-name: from-right;
	}
	.right {
		animation-name: from-left;
	}
	@keyframes from-right {
		from {
			transform: translateX(var(--travel));
		}
	}
	@keyframes from-left {
		from {
			transform: translateX(calc(-1 * var(--travel)));
		}
	}
	.manifesto {
		max-width: 700px;
		font-size: 22px;
		line-height: 1.6;
	}
	.manifesto p {
		margin: 0;
	}
	.manifesto p + p {
		margin-top: 14px;
	}
	.services {
		margin: 44px 0 0;
		padding: 0;
		list-style: none;
		font-size: 15px;
		line-height: 1.9;
		letter-spacing: 0.14em;
	}

	@media (prefers-reduced-motion: reduce) {
		.paren {
			animation: none;
		}
	}

	@media (max-width: 1023px) {
		.wordmark {
			margin-bottom: 64px;
			font-size: 24px;
			letter-spacing: 0.18em;
			--travel: 140px;
		}
		.manifesto {
			font-size: 17px;
			line-height: 1.55;
		}
		.manifesto p + p {
			margin-top: 12px;
		}
		.services {
			margin-top: 36px;
			font-size: 13px;
			letter-spacing: 0.12em;
		}
	}
</style>
