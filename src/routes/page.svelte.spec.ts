import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { stages } from '$lib/content';
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

	it('glides to a section from the nav: names it at once, holds the photos until arrival', async () => {
		render(Page);
		scrollTo(0, 0);
		const target = document.getElementById('contact')!.offsetTop;
		// Watch the nav label and the food reel, which the glide passes on its
		// way down.
		const foodAlt = stages.food.group.photos[0].alt;
		let sawFood = false;
		const labels = new Set<string>();
		const watch = new MutationObserver(() => {
			sawFood ||= !!document.querySelector(`img[alt="${foodAlt}"]`);
			labels.add(document.querySelector('nav .label')?.textContent ?? '');
		});
		watch.observe(document.body, { subtree: true, childList: true, attributes: true });
		nav.open = true;
		document.querySelector<HTMLAnchorElement>('nav a[href="#contact"]')!.click();

		// 300ms in, an ease-in-out glide has barely started (native smooth
		// scrolling would be most of the way there), but the nav already
		// names the destination.
		await new Promise((r) => setTimeout(r, 300));
		expect(scrollY).toBeGreaterThan(0);
		expect(scrollY).toBeLessThan(target * 0.2);
		expect(document.querySelector('nav .label')?.textContent).toBe('contact');

		await expect.poll(() => Math.round(scrollY), { timeout: 4000 }).toBe(target);
		// Arrived: the reel retunes to contact, never having shown food, and
		// the label never named a section passed on the way.
		await expect
			.poll(() => document.querySelector<HTMLElement>('.backdrop')?.style.cssText)
			.toContain(stages.contact.scrimDesktop);
		watch.disconnect();
		expect(sawFood).toBe(false);
		expect([...labels]).not.toContain('food');
		expect([...labels]).not.toContain('music');
		expect(document.querySelector('nav .label')?.textContent).toBe('contact');
	});

	it('names the section actually in view if the user breaks off a glide', async () => {
		render(Page);
		scrollTo(0, 0);
		nav.open = true;
		document.querySelector<HTMLAnchorElement>('nav a[href="#contact"]')!.click();
		await new Promise((r) => setTimeout(r, 300));
		expect(document.querySelector('nav .label')?.textContent).toBe('contact');

		// Still in the home section's half of the screen when interrupted.
		window.dispatchEvent(new WheelEvent('wheel'));
		await expect.poll(() => document.querySelector('nav .label')?.textContent).toBe('home');
	});
});
