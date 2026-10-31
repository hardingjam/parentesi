<script lang="ts">
	import Stage from '$lib/components/Stage.svelte';

	const soundcloudSrc =
		'https://w.soundcloud.com/player/?url=' +
		encodeURIComponent('https://soundcloud.com/planatia') +
		'&color=%23d6cfaf&auto_play=false&show_user=true&visual=false';
</script>

<Stage id="music">
	<div class="intro rise" style="--d: 100ms">
		<h2>( music )</h2>
		<p class="body">Sound curation by Planatia.</p>
		<!-- Placeholder until the owner sends the real copy. -->
		<p class="body">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
			labore et dolore magna aliqua.
		</p>
	</div>
	<div class="equation heading rise" style="--d: 150ms">
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
	<ul class="outlinks small rise" style="--d: 450ms">
		<li><a class="link" href="https://soundcloud.com/planatia" rel="external">soundcloud</a></li>
		<li><a class="link" href="https://www.instagram.com/planatia/" rel="external">instagram</a></li>
		<li><a class="link" href="https://www.radiocircolo.com/" rel="external">radio circolo</a></li>
		<li><a class="link" href="mailto:pietroplatania89@gmail.com">bookings</a></li>
	</ul>
</Stage>

<style>
	.intro {
		max-width: 560px;
		margin-bottom: var(--space-4);
	}
	h2 {
		margin-bottom: var(--space-3);
	}
	.intro p + p {
		margin-top: var(--space-2);
	}
	.equation p + p {
		margin-top: var(--space-3);
	}
	.eq {
		white-space: nowrap;
	}
	.embed {
		width: 560px;
		max-width: 100%;
		margin-top: var(--space-4);
		border: 1px solid color-mix(in srgb, var(--ecru) 45%, transparent);
	}
	.embed iframe {
		display: block;
		width: 100%;
		border: 0;
	}
	.outlinks {
		display: flex;
		gap: var(--space-4);
		margin-top: var(--space-4);
	}

	@media (max-width: 1023px) {
		/* The handoff asks for a break before "=" on mobile. */
		.equation .eq {
			display: block;
		}
		.embed {
			width: 100%;
		}
		.embed iframe {
			height: 100px;
		}
		.outlinks {
			flex-direction: column;
			gap: var(--space-2);
		}
		.outlinks a {
			display: inline-flex;
			align-items: center;
			min-height: 44px;
		}
	}
</style>
