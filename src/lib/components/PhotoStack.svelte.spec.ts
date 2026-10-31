import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { stages } from '$lib/content';
import PhotoStack from './PhotoStack.svelte';

describe('PhotoStack.svelte', () => {
	it('renders the route group’s first photo immediately', async () => {
		render(PhotoStack, { spec: stages.home });
		await expect.element(page.getByAltText(stages.home.group.photos[0].alt)).toBeInTheDocument();
	});

	it('dissolves into the new group when the spec changes route', async () => {
		const screen = render(PhotoStack, { spec: stages.home });
		await expect.element(page.getByAltText(stages.home.group.photos[0].alt)).toBeInTheDocument();
		await screen.rerender({ spec: stages.food });
		// the food group's first photo is fetched, decoded and faded in
		await expect.element(page.getByAltText(stages.food.group.photos[0].alt)).toBeInTheDocument();
		await expect
			.poll(
				() => {
					const img = document.querySelector(`img[alt="${stages.food.group.photos[0].alt}"]`);
					return img ? getComputedStyle(img).opacity : '0';
				},
				{ timeout: 5000 }
			)
			.toBe('1');
	});

	it('ignores scroll input (the reel has no wheel/touch handlers)', async () => {
		render(PhotoStack, { spec: stages.home });
		const before = document.querySelector('.stack img.shown')?.getAttribute('alt');
		window.dispatchEvent(new WheelEvent('wheel', { deltaY: 900 }));
		await new Promise((r) => setTimeout(r, 150));
		expect(document.querySelector('.stack img.shown')?.getAttribute('alt')).toBe(before);
	});
});
