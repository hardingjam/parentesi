<script lang="ts">
	import Stage from '$lib/components/Stage.svelte';
</script>

<Stage id="contact">
	<div class="row rise" style="--d: 100ms">
		<span class="big left" aria-hidden="true">(</span>
		<div class="reveal block">
			<!-- Line icons from Feather (MIT), drawn in the text colour. -->
			<ul class="icons">
				<li>
					<a
						href="mailto:pietroplatania89@gmail.com"
						aria-label="Email pietroplatania89@gmail.com"
						title="pietroplatania89@gmail.com"
					>
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path
								d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
							/>
							<polyline points="22,6 12,13 2,6" />
						</svg>
					</a>
				</li>
				<li>
					<a href="tel:+393408732532" aria-label="Call +39 340 873 2532" title="+39 340 873 2532">
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path
								d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
							/>
						</svg>
					</a>
				</li>
				<li>
					<a
						href="https://www.instagram.com/parentesi.berlin/"
						rel="external"
						aria-label="parentesi.berlin on Instagram"
						title="@parentesi.berlin"
					>
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
							<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
							<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
						</svg>
					</a>
				</li>
			</ul>
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
	.icons {
		display: flex;
		gap: 28px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.icons a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		transition: opacity 200ms;
	}
	.icons a:hover,
	.icons a:focus-visible {
		opacity: 0.7;
	}
	.icons svg {
		width: 30px;
		height: 30px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-linejoin: round;
		/* The copy's legibility halo (text-shadow doesn't reach SVG). */
		filter: drop-shadow(0 1px 2px rgba(11, 10, 8, 0.55))
			drop-shadow(0 2px 16px rgba(11, 10, 8, 0.5));
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
