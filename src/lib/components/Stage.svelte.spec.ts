import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import { nav } from '$lib/nav.svelte';
import { stages } from '$lib/content';
import Stage from './Stage.svelte';

const content = createRawSnippet(() => ({
	render: () => '<p>stage content</p>'
}));

describe('Stage.svelte', () => {
	beforeEach(() => {
		nav.open = false;
	});

	it('renders every photo with an alt and the content snippet', async () => {
		render(Stage, { spec: stages.home, children: content });
		await expect.element(page.getByText('stage content')).toBeVisible();
		for (const photo of stages.home.photos) {
			await expect.element(page.getByAltText(photo.alt)).toBeInTheDocument();
		}
	});

	it('shows the photo credit', async () => {
		render(Stage, {
			spec: stages.contact,
			credit: 'Photos: Fredericke Alma Sauerbrey, Zoe Spawton',
			children: content
		});
		await expect
			.element(page.getByText('Photos: Fredericke Alma Sauerbrey, Zoe Spawton'))
			.toBeVisible();
	});

	it('hard-cuts between photos under prefers-reduced-motion (no WAAPI animations)', async () => {
		vi.useFakeTimers();
		const original = window.matchMedia.bind(window);
		const spy = vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
			if (query.includes('prefers-reduced-motion')) {
				return { matches: true, media: query } as MediaQueryList;
			}
			return original(query);
		});
		try {
			render(Stage, { spec: stages.home, children: content });
			// let the $effect run
			await Promise.resolve();
			const imgs = [...document.querySelectorAll<HTMLImageElement>('.stack img')];
			expect(imgs.flatMap((el) => el.getAnimations()).length).toBe(0);
			expect(imgs.filter((el) => el.style.opacity === '1').length).toBe(1);
			expect(imgs[0].style.opacity).toBe('1');
			// after one photo interval the next photo cuts in
			vi.advanceTimersByTime(7000);
			expect(imgs[0].style.opacity).toBe('0');
			expect(imgs[1].style.opacity).toBe('1');
		} finally {
			spy.mockRestore();
			vi.useRealTimers();
		}
	});

	it('dims the content and raises the nav scrim while the nav is open', async () => {
		render(Stage, { spec: stages.home, children: content });
		const stageContent = page.getByText('stage content');
		await expect.element(stageContent).toBeVisible();
		nav.open = true;
		await expect
			.poll(() => {
				const dimmed = document.querySelector('.content.dimmed');
				const scrim = document.querySelector('.nav-scrim.visible');
				return Boolean(dimmed && scrim);
			})
			.toBe(true);
	});
});
