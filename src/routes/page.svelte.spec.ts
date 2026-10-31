import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('one-page scroll spy', () => {
	it('marks the section in view in the nav and retunes the reel', async () => {
		render(Page);
		const music = page.getByRole('link', { name: 'music', includeHidden: true });
		await expect.element(music).not.toHaveAttribute('aria-current');

		document.getElementById('music')?.scrollIntoView();

		await expect.element(music).toHaveAttribute('aria-current', 'location');
		// The music section's darker filter is on the reel's photos.
		await expect
			.poll(() => document.querySelector<HTMLImageElement>('.stack img')?.style.filter)
			.toContain('brightness');
	});
});
