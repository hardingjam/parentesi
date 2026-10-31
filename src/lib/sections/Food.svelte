<script lang="ts">
	import Stage from '$lib/components/Stage.svelte';

	// Non-breaking space before the stars so they never wrap alone.
	const restaurants = [
		'Le Bristol\u00a0***',
		'Il Luogo di Aimo e Nadia\u00a0**',
		'Joia\u00a0*',
		'Vun\u00a0**',
		'Chez Panisse'
	];
	const services = [
		'pop-up dinners',
		'tailor-made catering',
		'cooking workshops',
		'food consulting'
	];
	// Dishes 2-5 are placeholders flagged in the design handoff; the owner
	// supplies the real menu later.
	const menu = [
		'Polenta tuile, spirulina — horseradish paté, grilled radish',
		'Charred leek, hazelnut milk — smoked plum, bread ash',
		'Jerusalem artichoke, koji — sunflower, black garlic',
		'Beetroot aged in salt — blackcurrant leaf, walnut',
		'Quince, chamomile — olive oil, buckwheat'
	];
</script>

<Stage id="food">
	<div class="grid">
		<div class="bio rise" style="--d: 150ms">
			<h2>Pietro Platania</h2>
			<p class="body">Italian chef, trained at Le Cordon Bleu Paris.</p>
			<ul class="body list">
				{#each restaurants as restaurant (restaurant)}
					<li>{restaurant}</li>
				{/each}
			</ul>
			<p class="body">
				Founder of Banco Natural Food, Rome. Now cooking in Berlin — plant-based, circular,
				itinerant.
			</p>
			<ul class="service-grid small list">
				{#each services as service (service)}
					<li>{service}</li>
				{/each}
			</ul>
		</div>
		<div class="menu rise" style="--d: 300ms">
			<p class="small">( sample menu )</p>
			{#each menu as dish (dish)}
				<p class="body">{dish}</p>
			{/each}
			<p class="small">( )</p>
		</div>
	</div>
</Stage>

<style>
	.grid {
		width: 100%;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: var(--space-5);
		text-align: left;
	}
	.bio,
	.menu {
		display: flex;
		flex-direction: column;
	}
	.bio {
		gap: var(--space-3);
		/* The services grid below switches on when this column is wide
		   enough for it. */
		container-type: inline-size;
	}
	.menu {
		gap: var(--space-3);
	}
	/* Services as a 2 × 2 grid with a · between the columns, wherever the
	   column fits it (measured: 426px at 15px, i.e. desktops from ~1300px);
	   narrower they stay a plain list. */
	@container (min-width: 428px) {
		.service-grid {
			display: grid;
			grid-template-columns: repeat(2, max-content);
		}
		.service-grid li:nth-child(even)::before {
			content: '·';
			margin: 0 0.5em;
		}
	}

	@media (max-width: 1023px) {
		.grid {
			/* Stacked, the 64px phone --space-5 separates the services from
			   the menu. */
			display: flex;
			flex-direction: column;
		}
		.service-grid {
			/* Plus the bio's gap: twice the CV's own spacing above the
			   services. */
			margin-top: var(--space-3);
			/* Exception to the .12em small tracking: tightened so the 2 × 2
			   grid fits a 390px phone. */
			letter-spacing: 0.04em;
			text-align: center;
		}
	}
	/* Phones and tablets: the same grid in two halves with the · centred
	   between them, wherever it fits (measured: 330px at 13px, i.e. phones
	   from ~386px); narrower it stays a centred list. On phones the halves
	   are barely wider than the words, so each service hugs the ·. */
	@media (max-width: 1023px) {
		@container (min-width: 332px) {
			.service-grid {
				display: grid;
				grid-template-columns: 1fr 1fr;
				column-gap: 1.6em;
				white-space: nowrap;
			}
			.service-grid li:nth-child(odd) {
				text-align: right;
			}
			.service-grid li:nth-child(even) {
				position: relative;
				text-align: left;
			}
			.service-grid li:nth-child(even)::before {
				content: '·';
				position: absolute;
				right: calc(100% + 0.8em);
				margin: 0;
				transform: translateX(50%);
			}
		}
		/* Tablets: each service centred in its half, so the grid spreads
		   evenly across the column. */
		@container (min-width: 520px) {
			.service-grid li:nth-child(n) {
				text-align: center;
			}
		}
	}
</style>
