import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { nav } from '$lib/nav.svelte';
import { stagePhotos, stages } from '$lib/content';
import PhotoStack from './PhotoStack.svelte';

describe('PhotoStack.svelte', () => {
	beforeEach(() => {
		nav.open = false;
	});

	it('renders the full site-wide reel with alts', async () => {
		render(PhotoStack, { spec: stages.home });
		for (const photo of stagePhotos) {
			await expect.element(page.getByAltText(photo.alt)).toBeInTheDocument();
		}
	});

	it('keeps its pace regardless of nav state (no nav scrim over the photos)', async () => {
		render(PhotoStack, { spec: stages.home });
		nav.open = true;
		await Promise.resolve();
		expect(document.querySelector('.nav-scrim')).toBeNull();
	});

	it('ignores scroll input (no wheel/touch listeners on the reel)', async () => {
		render(PhotoStack, { spec: stages.home });
		await Promise.resolve();
		const anims = [...document.querySelectorAll('.stack img')].flatMap((el) => el.getAnimations());
		expect(anims.length).toBeGreaterThan(0);
		window.dispatchEvent(new WheelEvent('wheel', { deltaY: 600 }));
		await new Promise((r) => setTimeout(r, 100));
		for (const anim of anims) expect(anim.playbackRate).toBe(1);
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
			render(PhotoStack, { spec: stages.home });
			// let the $effect run
			await Promise.resolve();
			const imgs = [...document.querySelectorAll<HTMLImageElement>('.stack img')];
			expect(imgs.length).toBe(stagePhotos.length);
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
});
