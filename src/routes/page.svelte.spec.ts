import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { nav } from '$lib/nav.svelte';
import Page from './+page.svelte';

// The router isn't running in component tests.
vi.mock('$app/navigation', () => ({ pushState: vi.fn() }));

describe('one-page scroll', () => {
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

	it('glides slowly to a section from the nav, easing in', async () => {
		render(Page);
		scrollTo(0, 0);
		const target = document.getElementById('contact')!.offsetTop;
		nav.open = true;
		document.querySelector<HTMLAnchorElement>('nav a[href="#contact"]')!.click();

		// 300ms in, an ease-in-out glide has barely started (native smooth
		// scrolling would be most of the way there).
		await new Promise((r) => setTimeout(r, 300));
		expect(scrollY).toBeGreaterThan(0);
		expect(scrollY).toBeLessThan(target * 0.2);

		await expect.poll(() => Math.round(scrollY), { timeout: 4000 }).toBe(target);
	});
});
