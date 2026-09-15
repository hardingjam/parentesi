import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { srcset, stagePhotos, stages } from './content';

describe('stagePhotos', () => {
	it('holds the 3-4 photo site-wide reel', () => {
		expect(stagePhotos.length).toBeGreaterThanOrEqual(3);
		expect(stagePhotos.length).toBeLessThanOrEqual(4);
	});

	it('gives every photo a non-empty alt', () => {
		for (const photo of stagePhotos) expect(photo.alt.length).toBeGreaterThan(0);
	});

	it('references only generated image files', () => {
		for (const { slug } of stagePhotos) {
			for (const w of [1080, 1920]) {
				expect(existsSync(`static/img/${slug}-${w}.webp`), `${slug}-${w}`).toBe(true);
			}
		}
	});

	it('builds a srcset from a slug', () => {
		expect(srcset('cover')).toBe('/img/cover-1080.webp 1080w, /img/cover-1920.webp 1920w');
	});
});

describe('stages', () => {
	it('defines a scrim treatment for all four routes', () => {
		for (const key of ['home', 'food', 'music', 'contact'] as const) {
			expect(stages[key].scrimDesktop).toContain('radial-gradient');
			expect(stages[key].scrimMobile).toContain('radial-gradient');
		}
	});
});
