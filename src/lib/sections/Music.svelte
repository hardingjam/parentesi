<script lang="ts">
	import Stage from '$lib/components/Stage.svelte';

	const soundcloudSrc =
		'https://w.soundcloud.com/player/?url=' +
		encodeURIComponent('https://soundcloud.com/planatia') +
		'&color=%23d6cfaf&auto_play=false&show_user=true&visual=false';
</script>

<Stage id="music">
	<div class="equation rise" style="--d: 150ms">
		<p>Tastes like sound <span class="eq">= Planatia</span></p>
		<p>Sounds like taste <span class="eq">= ( parentesi )</span></p>
	</div>
	<div class="embed rise" style="--d: 300ms">
		<iframe
			title="Planatia on SoundCloud"
			src={soundcloudSrc}
			height="120"
			allow="autoplay"
			loading="lazy"
		></iframe>
	</div>
	<ul class="links rise" style="--d: 450ms">
		<li><a href="https://soundcloud.com/planatia" rel="external">soundcloud</a></li>
		<li><a href="https://www.instagram.com/planatia/" rel="external">instagram</a></li>
		<li><a href="mailto:parentesi.berlin@gmail.com">bookings</a></li>
	</ul>
</Stage>

<style>
	.equation {
		font-size: 36px;
		line-height: 1.3;
		letter-spacing: 0.04em;
	}
	.equation p {
		margin: 0;
	}
	.equation p + p {
		margin-top: 18px;
	}
	.eq {
		white-space: nowrap;
	}
	.embed {
		width: 560px;
		max-width: 100%;
		margin-top: 56px;
		border: 1px solid rgba(214, 207, 175, 0.45);
	}
	.embed iframe {
		display: block;
		width: 100%;
		border: 0;
	}
	.links {
		display: flex;
		gap: 40px;
		margin: 56px 0 0;
		padding: 0;
		list-style: none;
		font-size: 15px;
		letter-spacing: 0.14em;
	}
	.links a {
		border-bottom: 1px solid rgba(214, 207, 175, 0.5);
		transition: border-color 200ms;
	}
	.links a:hover {
		border-color: var(--ecru);
	}

	@media (max-width: 1023px) {
		.equation {
			font-size: 22px;
			line-height: 1.35;
			letter-spacing: 0.03em;
		}
		/* The handoff asks for a break before "=" on mobile. */
		.equation .eq {
			display: block;
		}
		.equation p + p {
			margin-top: 16px;
		}
		.embed {
			width: 100%;
			margin-top: 44px;
		}
		.embed iframe {
			height: 100px;
		}
		.links {
			flex-direction: column;
			gap: 14px;
			margin-top: 44px;
			font-size: 13px;
			letter-spacing: 0.12em;
		}
		.links a {
			display: inline-flex;
			align-items: center;
			min-height: 44px;
		}
	}
</style>
