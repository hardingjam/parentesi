<script lang="ts">
	import Stage from '$lib/components/Stage.svelte';
</script>

<Stage id="contact">
	<div class="row rise" style="--d: 100ms">
		<span class="big left" aria-hidden="true">(</span>
		<div class="reveal block">
			<a class="link" href="mailto:parentesi.berlin@gmail.com">parentesi.berlin@gmail.com</a>
			<a class="link" href="tel:+393408732532">+39 340 873 2532</a>
			<!-- Instagram handle TBC with owner; placeholder points at Planatia -->
			<a class="link" href="https://www.instagram.com/planatia/" rel="external">instagram</a>
			<p class="place">Berlin · itinerant</p>
		</div>
		<span class="big right" aria-hidden="true">)</span>
	</div>
</Stage>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: 56px;
	}
	.big {
		font-size: 440px;
		line-height: 1;
		transform: translateY(-4%);
		animation: 1100ms var(--ease-paren) 300ms both;
	}
	.left {
		animation-name: from-right;
	}
	.right {
		animation-name: from-left;
	}
	@keyframes from-right {
		from {
			transform: translateY(-4%) translateX(200px);
		}
	}
	@keyframes from-left {
		from {
			transform: translateY(-4%) translateX(-200px);
		}
	}
	.block {
		display: flex;
		flex-direction: column;
		gap: 22px;
		align-items: center;
		font-size: var(--text-md);
		line-height: 1.4;
		letter-spacing: 0.04em;
	}
	.block p {
		margin: 0;
	}
	.place {
		margin-top: 10px;
	}

	@media (prefers-reduced-motion: reduce) {
		.big {
			animation: none;
		}
	}

	@media (max-width: 1023px) {
		.row {
			flex-direction: column;
			gap: 8px;
		}
		.big {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 240px;
			height: 120px;
			font-size: 200px;
			transform: none;
		}
		/* With rotate(90deg) applied first, translateX moves along the rotated
		   axis — i.e. vertically — giving the from-above/from-below entrance. */
		.left {
			transform: rotate(90deg);
			animation-name: from-below;
		}
		.right {
			transform: rotate(90deg);
			animation-name: from-above;
		}
		@keyframes from-below {
			from {
				transform: rotate(90deg) translateX(130px);
			}
		}
		@keyframes from-above {
			from {
				transform: rotate(90deg) translateX(-130px);
			}
		}
		.block {
			gap: 18px;
			padding: 24px 0;
			letter-spacing: 0.03em;
		}
	}
</style>
