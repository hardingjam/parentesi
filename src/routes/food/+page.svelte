<script lang="ts">
	import Stage from '$lib/components/Stage.svelte';

	const restaurants = [
		'Le Bristol***',
		'Il Luogo di Aimo e Nadia**',
		'Joia*',
		'Vun**',
		'Chez Panisse'
	];
	const services = [
		'supper-club events',
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

<svelte:head>
	<title>( food ) — parentesi</title>
</svelte:head>

<Stage>
	<div class="frame">
		<div class="grid">
			<div class="bio rise" style="--d: 150ms">
				<!-- The route heading lives in the nav mark: `( food )` -->
				<h2>Pietro Platania</h2>
				<p>Italian chef, trained at Le Cordon Bleu Paris.</p>
				<ul class="restaurants">
					{#each restaurants as restaurant (restaurant)}
						<li>{restaurant}</li>
					{/each}
				</ul>
				<p>
					Founder of Banco Natural Food, Rome. Now cooking in Berlin — plant-based, circular,
					itinerant.
				</p>
				<ul class="services">
					{#each services as service (service)}
						<li>{service}</li>
					{/each}
				</ul>
			</div>
			<div class="menu rise" style="--d: 300ms">
				<p class="label">( a sample menu )</p>
				{#each menu as dish (dish)}
					<p class="dish">{dish}</p>
				{/each}
				<p class="label">( )</p>
			</div>
		</div>
	</div>
</Stage>

<style>
	.frame {
		width: 100%;
	}
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 120px;
		text-align: left;
	}
	.label {
		margin: 0;
		font-size: 15px;
		letter-spacing: 0.14em;
	}
	.bio,
	.menu {
		display: flex;
		flex-direction: column;
	}
	.bio {
		gap: 28px;
	}
	.menu {
		gap: 22px;
		max-height: 560px;
		overflow-y: auto;
		scrollbar-width: none;
		/* Content starts/ends beyond the mask's fade zones so nothing sits
		   half-faded at rest — the fades only ever eat scrolled-away text. */
		padding: 60px 0;
		mask-image: linear-gradient(
			to bottom,
			transparent,
			#000 60px,
			#000 calc(100% - 60px),
			transparent
		);
	}
	.menu::-webkit-scrollbar {
		display: none;
	}
	h2 {
		margin: 0;
		font-size: 32px;
		font-weight: 400;
		line-height: 1.2;
		letter-spacing: 0.04em;
	}
	.bio p {
		margin: 0;
		font-size: 17px;
		line-height: 1.65;
	}
	.restaurants {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 17px;
		line-height: 1.4;
	}
	.services {
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 15px;
		line-height: 1.9;
		letter-spacing: 0.14em;
	}
	.dish {
		margin: 0;
		font-size: 18px;
		line-height: 1.55;
	}

	@media (max-width: 1023px) {
		.frame {
			position: absolute;
			top: 120px;
			right: 28px;
			bottom: 80px;
			left: 28px;
			/* Cancel the base width:100% — with left+width set, right would be
			   ignored and the frame would overflow the viewport. */
			width: auto;
			overflow-y: auto;
			padding-top: 40px;
			touch-action: pan-y;
			scrollbar-width: none;
			mask-image: linear-gradient(
				to bottom,
				transparent,
				#000 40px,
				#000 calc(100% - 60px),
				transparent
			);
		}
		.frame::-webkit-scrollbar {
			display: none;
		}
		.grid {
			display: flex;
			flex-direction: column;
			gap: 22px;
		}
		.menu {
			max-height: none;
			overflow: visible;
			mask-image: none;
			gap: 14px;
		}
		.menu > .label:first-child {
			margin-top: 18px;
		}
		.label {
			font-size: 13px;
			letter-spacing: 0.12em;
		}
		h2 {
			font-size: 24px;
		}
		.bio {
			gap: 22px;
		}
		.bio p {
			font-size: 15px;
			line-height: 1.6;
		}
		.restaurants {
			gap: 8px;
			font-size: 15px;
		}
		.services {
			font-size: 13px;
			letter-spacing: 0.12em;
		}
		.dish {
			font-size: 15px;
			line-height: 1.5;
		}
	}
</style>
