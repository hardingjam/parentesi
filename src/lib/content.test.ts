import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { srcset, stages } from './content';

describe('stages', () => {
	it('defines all four routes with 3-4 photos each', () => {
		for (const key of ['home', 'food', 'music', 'contact'] as const) {
			const n = stages[key].photos.length;
			expect(n, `${key} photo count`).toBeGreaterThanOrEqual(3);
			expect(n, `${key} photo count`).toBeLessThanOrEqual(4);
		}
	});

	it('gives every photo a non-empty alt', () => {
		for (const spec of Object.values(stages)) {
			for (const photo of spec.photos) expect(photo.alt.length).toBeGreaterThan(0);
		}
	});

	it('references only generated image files', () => {
		for (const spec of Object.values(stages)) {
			for (const { slug } of spec.photos) {
				for (const w of [1080, 1920]) {
					expect(existsSync(`static/img/${slug}-${w}.webp`), `${slug}-${w}`).toBe(true);
				}
			}
		}
	});

	it('builds a srcset from a slug', () => {
		expect(srcset('cover')).toBe('/img/cover-1080.webp 1080w, /img/cover-1920.webp 1920w');
	});
});
