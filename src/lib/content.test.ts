import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { groups, srcset, stages } from './content';

// Resolved from this file, not the process cwd, so the suite works no
// matter which directory vitest is launched from.
const imgDir = new URL('../../static/img/', import.meta.url);

describe('photo groups', () => {
	it('every group has at least 3 photos with non-empty alts', () => {
		for (const group of Object.values(groups)) {
			expect(group.photos.length, group.id).toBeGreaterThanOrEqual(3);
			for (const photo of group.photos) expect(photo.alt.length, photo.slug).toBeGreaterThan(0);
		}
	});

	it('references only generated image files', () => {
		for (const group of Object.values(groups)) {
			for (const { slug } of group.photos) {
				for (const w of [1080, 1920]) {
					const file = fileURLToPath(new URL(`${slug}-${w}.webp`, imgDir));
					expect(existsSync(file), `${slug}-${w}`).toBe(true);
				}
			}
		}
	});

	it('builds a srcset from a slug', () => {
		expect(srcset('cover')).toBe('/img/cover-1080.webp 1080w, /img/cover-1920.webp 1920w');
	});
});

describe('stages', () => {
	it('gives every section a group and a scrim treatment', () => {
		for (const key of ['home', 'food', 'music', 'contact'] as const) {
			expect(stages[key].group.photos.length).toBeGreaterThan(0);
			expect(stages[key].scrimDesktop).toContain('radial-gradient');
			expect(stages[key].scrimMobile).toContain('radial-gradient');
		}
	});

	it('plays the food reel in the food section', () => {
		expect(stages.food.group.id).toBe('food');
	});

	it('shows Pietro and Vincenzo and one food plate on home', () => {
		const slugs = stages.home.group.photos.map((p) => p.slug);
		expect(slugs).toContain('pietro-vincenzo');
		expect(slugs.filter((s) => s.startsWith('food-'))).toEqual(['food-06']);
	});
});
