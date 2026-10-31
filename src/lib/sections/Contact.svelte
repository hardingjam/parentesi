<script lang="ts">
	import Stage from '$lib/components/Stage.svelte';
</script>

<Stage id="contact">
	<div class="row rise" style="--d: 100ms">
		<span class="big left" aria-hidden="true">(</span>
		<div class="reveal block">
			<!-- Line icons from Feather (MIT), drawn in the text colour. -->
			<div class="icons">
				<a
					href="mailto:pietroplatania89@gmail.com"
					aria-label="Email pietroplatania89@gmail.com"
					title="pietroplatania89@gmail.com"
				>
					<svg viewBox="0 0 24 24" aria-hidden="true"
						><path
							d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
						/><polyline points="22,6 12,13 2,6" /></svg
					>
				</a>
				<a
					href="https://www.instagram.com/parentesi.berlin/"
					rel="external"
					aria-label="parentesi.berlin on Instagram"
					title="@parentesi.berlin"
				>
					<svg viewBox="0 0 24 24" aria-hidden="true"
						><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path
							d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
						/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg
					>
				</a>
			</div>
			<!-- Plain text so it can be selected and copied (one click selects
			     it all). -->
			<p class="number">+39 340 873 2532</p>
		</div>
		<span class="big right" aria-hidden="true">)</span>
	</div>
</Stage>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: 40px;
	}
	.big {
		font-size: 300px;
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
			transform: translateY(-4%) translateX(140px);
		}
	}
	@keyframes from-left {
		from {
			transform: translateY(-4%) translateX(-140px);
		}
	}
	.block {
		display: flex;
		flex-direction: column;
		gap: 22px;
		align-items: center;
		font-size: var(--text-lg);
		line-height: 1.4;
		letter-spacing: 0.04em;
	}
	.block p {
		margin: 0;
	}
	.icons {
		display: flex;
		gap: 32px;
	}
	.icons a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
	}
	.icons svg {
		width: 48px;
		height: 48px;
		transition: transform 300ms var(--ease-entrance);
		fill: none;
		stroke: currentColor;
		stroke-width: 1.25;
		stroke-linecap: round;
		stroke-linejoin: round;
		/* The copy's legibility halo (text-shadow doesn't reach SVG). */
		filter: drop-shadow(0 1px 2px rgba(11, 10, 8, 0.55))
			drop-shadow(0 2px 16px rgba(11, 10, 8, 0.5));
	}
	.icons a:hover svg,
	.icons a:focus-visible svg {
		transform: scale(1.12);
	}
	.number {
		user-select: all;
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
			width: 170px;
			height: 84px;
			font-size: 140px;
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
				transform: rotate(90deg) translateX(90px);
			}
		}
		@keyframes from-above {
			from {
				transform: rotate(90deg) translateX(-90px);
			}
		}
		.block {
			gap: 18px;
			padding: 24px 0;
			letter-spacing: 0.03em;
		}
	}
</style>
